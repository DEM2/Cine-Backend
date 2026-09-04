// app/src/services/reservation.service.ts

import { Op, UniqueConstraintError } from "sequelize";
import sequelize from "../config/database";
import AppError from "../error/appError";
import { MAX_TICKETS_PER_SHOWTIME, SEAT_LOCK_TTL_MINUTES } from "../config/seat-lock.config";
import Showtime from "../models/showtime.model";
import Seat from "../models/complex/seat.model";
import SeatType from "../models/complex/seat-type.model";
import cartSeatRepository from "../repositories/cart-seat.repository";
import seatRepository from "../repositories/seat.repository";
import { LockSeatsDto } from "../dto/reservations/lock-seats.dto";
import { ReleaseSeatsDto } from "../dto/reservations/release-seats.dto";
import { SummaryResponseDto } from "../dto/reservations/summary-response.dto";
import functionService from "./funtion.service";
import {
  IReservationService,
  LockSeatsResult,
  ShowtimeSeatDto,
} from "./interfaces/seats-reservation.service.interface";

type SeatWithType = Seat & { seatType: SeatType };

/**
 * Servicio de Reservas
 * ---------------------
 * Contiene la lógica de negocio relacionada con el bloqueo/liberación de
 * sillas de una función y la consulta del mapa de sillas disponibles.
 */

class ReservationService implements IReservationService {

  async getShowtimeSeats(showtimeId: number): Promise<ShowtimeSeatDto[]> {
    const functionPrice = await functionService.getPrice(showtimeId);
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      throw new AppError(404, "Función no encontrada.");
    }

    const seats = (await seatRepository.findEnabledByRoomWithType(showtime.roomId)) as SeatWithType[];
    const locked = await cartSeatRepository.findLockedByShowtime(showtimeId);
    const lockedBySeat = new Map<number, number>();
    for (const lock of locked) {
      lockedBySeat.set(lock.seatId, lock.cartId);
    }

    return seats.map((seat) => ({
      id: seat.id,
      code: seat.code,
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType
        ? {
            id: seat.seatType.id,
            code: seat.seatType.code,
            name: seat.seatType.name,
          }
        : null,
      status: lockedBySeat.has(seat.id) ? "locked" : "available",
      lockedByCartId: lockedBySeat.get(seat.id) ?? null,
      price:
        functionPrice.finalPrice + Number(seat.seatType?.extraCharge ?? 0),
    }));
  }

  async lockSeats(dto: LockSeatsDto): Promise<LockSeatsResult> {
    if (!dto.cartId || !dto.showtimeId) {
      throw new AppError(400, "cartId y showtimeId son obligatorios.");
    }

    const seatIds = [...new Set(dto.seatIds)];
    if (seatIds.length === 0) {
      throw new AppError(400, "Debes indicar al menos una silla.");
    }

    const functionPrice = await functionService.getPrice(dto.showtimeId);
    const showtime = await Showtime.findByPk(dto.showtimeId);
    if (!showtime) {
      throw new AppError(404, "Función no encontrada.");
    }

    const seats = (await Seat.findAll({
      where: { id: { [Op.in]: seatIds } },
      include: [{ model: SeatType, as: "seatType" }],
    })) as SeatWithType[];

    const seatMap = new Map(seats.map((seat) => [seat.id, seat]));

    for (const seatId of seatIds) {
      const seat = seatMap.get(seatId);
      if (!seat) {
        throw new AppError(400, `La silla ${seatId} no existe.`);
      }
      if (!seat.isEnabled) {
        throw new AppError(400, `La silla ${seat.code} está inhabilitada.`);
      }
      if (seat.roomId !== showtime.roomId) {
        throw new AppError(
          400,
          `La silla ${seat.code} no pertenece a la sala de la función.`
        );
      }
    }

    // Toda la verificación de vigencia/conflictos y la inserción se hacen
    // dentro de UNA transacción para evitar sobreventas por concurrencia.
    const transaction = await sequelize.transaction();
    try {
      // Higiene: purga bloqueos expirados (incluye legacy sin expires_at)
      // antes de evaluar conflictos, para que las sillas liberadas
      // vuelvan a estar disponibles de inmediato.
      await cartSeatRepository.deleteExpired({ transaction });

      const locked = await cartSeatRepository.findLockedByShowtime(dto.showtimeId, { transaction });
      const mine = locked.filter((lock) => lock.cartId === dto.cartId);
      const mineSeatIds = new Set(mine.map((lock) => lock.seatId));
      const othersLockedBySeat = new Set(
        locked
          .filter((lock) => lock.cartId !== dto.cartId)
          .map((lock) => lock.seatId)
      );

      const toInsert = seatIds.filter((seatId) => !mineSeatIds.has(seatId));

      const conflict = seatIds.find((seatId) => othersLockedBySeat.has(seatId));
      if (conflict !== undefined) {
        throw new AppError(409, "Una o más sillas ya están bloqueadas.");
      }

      // Máximo de entradas por función (configurable vía .env).
      if (mine.length + toInsert.length > MAX_TICKETS_PER_SHOWTIME) {
        throw new AppError(
          400,
          `No puedes seleccionar más de ${MAX_TICKETS_PER_SHOWTIME} entradas para esta función.`
        );
      }

      if (toInsert.length === 0) {
        await transaction.commit();
        const total = mine.reduce((sum, seat) => sum + Number(seat.price), 0);
        return { seats: mine, total };
      }

      /**
       * Semántica del timer (RN-039): el tiempo inicia con el PRIMER bloqueo
       * del carrito para esta función y NO se extiende con bloqueos posteriores.
       * Los nuevos locks heredan el mismo expiresAt.
       */
      const cartExpiresAt =
        mine[0]?.expiresAt ?? new Date(Date.now() + SEAT_LOCK_TTL_MINUTES * 60_000);

      const rows = toInsert.map((seatId) => ({
        cartId: dto.cartId,
        showtimeId: dto.showtimeId,
        seatId,
        price:
          functionPrice.finalPrice +
          Number(seatMap.get(seatId)!.seatType?.extraCharge ?? 0),
        expiresAt: cartExpiresAt,
      }));

      const created = await cartSeatRepository.lockSeats(rows, { transaction });
      await transaction.commit();

      const seatsResult = [...mine, ...created];
      const total = seatsResult.reduce((sum, seat) => sum + Number(seat.price), 0);
      return { seats: seatsResult, total };
    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        throw new AppError(409, "Una o más sillas ya están bloqueadas.");
      }
      throw error;
    }
  }

  async releaseSeats(dto: ReleaseSeatsDto): Promise<number> {
    if (!dto.cartId || !dto.showtimeId) {
      throw new AppError(400, "cartId y showtimeId son obligatorios.");
    }

    if (!dto.seatIds || dto.seatIds.length === 0) {
      throw new AppError(400, "Debes indicar al menos una silla.");
    }

    const deleted = await cartSeatRepository.releaseSeats(
      dto.cartId,
      dto.showtimeId,
      dto.seatIds
    );

    if (deleted === 0) {
      throw new AppError(404, "No se encontraron sillas bloqueadas para liberar.");
    }

    return deleted;
  }

  async getReservationSummary(cartId: number, showtimeId: number): Promise<SummaryResponseDto> {
    if (!cartId || !showtimeId) {
      throw new AppError(400, "cartId y showtimeId son obligatorios.");
    }

    const locks = await cartSeatRepository.findValidByCartAndShowtimeWithDetails(cartId, showtimeId);

    if (!locks || locks.length === 0) {
      throw new AppError(404, "No hay sillas bloqueadas para este carrito y función.");
    }

    const showtime = locks[0].showtime;
    const seats = locks.map((lock: any) => ({
      id: lock.seat.id,
      code: lock.seat.code,
      rowLabel: lock.seat.rowLabel,
      seatNumber: lock.seat.seatNumber,
      seatType: lock.seat.seatType?.name ?? "Estándar",
      price: Number(lock.price),
    }));

    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    return {
      cartId,
      showtime: {
        id: showtime.id,
        movieId: showtime.movieId,
        roomId: showtime.roomId,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        basePrice: Number(showtime.basePrice),
      },
      seats,
      totalSeats: seats.length,
      totalAmount,
      expiresAt: locks[0].expiresAt,
    };
  }
}

export default new ReservationService();
