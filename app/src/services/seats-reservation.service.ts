// app/src/services/reservation.service.ts

import { Op, UniqueConstraintError } from "sequelize";
import sequelize from "../config/database";
import AppError from "../error/appError";
import Showtime from "../models/showtime.model";
import Seat from "../models/complex/seat.model";
import SeatType from "../models/complex/seat-type.model";
import cartSeatRepository from "../repositories/cart-seat.repository";
import seatRepository from "../repositories/seat.repository";
import { LockSeatsDto } from "../dto/reservations/lock-seats.dto";
import { ReleaseSeatsDto } from "../dto/reservations/release-seats.dto";
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
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime || !showtime.isActive) {
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
        Number(showtime.basePrice) + Number(seat.seatType?.extraCharge ?? 0),
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

    const showtime = await Showtime.findByPk(dto.showtimeId);
    if (!showtime || !showtime.isActive) {
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

    const locked = await cartSeatRepository.findLockedByShowtime(dto.showtimeId);
    const mine = locked.filter((lock) => lock.cartId === dto.cartId);
    const mineSeatIds = new Set(mine.map((lock) => lock.seatId));
    const othersLockedBySeat = new Map(
      locked
        .filter((lock) => lock.cartId !== dto.cartId)
        .map((lock) => [lock.seatId, lock.cartId])
    );

    const conflict = seatIds.find((seatId) => othersLockedBySeat.has(seatId));
    if (conflict) {
      throw new AppError(409, "Una o más sillas ya están bloqueadas.");
    }

    const toInsert = seatIds.filter((seatId) => !mineSeatIds.has(seatId));

    if (toInsert.length === 0) {
      const total = mine.reduce((sum, seat) => sum + Number(seat.price), 0);
      return { seats: mine, total };
    }

    const rows = toInsert.map((seatId) => {
      const seat = seatMap.get(seatId)!;
      return {
        cartId: dto.cartId,
        showtimeId: dto.showtimeId,
        seatId,
        price: Number(showtime.basePrice) + Number(seat.seatType?.extraCharge ?? 0),
      };
    });

    const transaction = await sequelize.transaction();
    try {
      const created = await cartSeatRepository.lockSeats(rows, {
        transaction,
      });
      await transaction.commit();
      const seats = [...mine, ...created];
      const total = seats.reduce((sum, seat) => sum + Number(seat.price), 0);
      return { seats, total };
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
}

export default new ReservationService();