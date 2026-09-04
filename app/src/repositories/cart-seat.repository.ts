import { Op, Transaction, WhereOptions } from "sequelize";
import CartSeat, { CartSeatCreationAttributes } from "../models/reservations/cart-seat.model";
import { ICartSeatRepository } from "./interfaces/cart-seat.repository.interface";

/**
 * Repositorio de Sillas Bloqueadas en Carrito (CartSeat)
 * --------------------------------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones de
 * persistencia relacionadas con la entidad `CartSeat`.
 *
 * Vigencia (RN-039/RN-040): un bloqueo está vigente solo si
 * `expires_at > NOW()`. Las filas con `expires_at` nulo corresponden a locks
 * previos a HU-010 y se tratan como expiradas (el cronjob las purga).
 */

/**
 * Condición de vigencia reutilizable. Se recalcula en cada consulta para que
 * la comparación con NOW() sea del momento exacto de la operación.
 */
const validLockWhere = (): WhereOptions => ({
  expiresAt: { [Op.gt]: new Date() },
});

class CartSeatRepository implements ICartSeatRepository {

  async lockSeats(rows: CartSeatCreationAttributes[], options?: { transaction?: Transaction }): Promise<CartSeat[]>{
    return await CartSeat.bulkCreate(rows, options);
  }

  async releaseSeats(cartId: number, showtimeId: number, seatIds: number[]): Promise<number> {
    const result = await CartSeat.destroy({
      where: {
        cartId,
        showtimeId,
        seatId: { [Op.in]: seatIds }, /** IN */ 
      },
    });
    return result;
  }

  async findLockedByShowtime(
    showtimeId: number,
    options?: { transaction?: Transaction }
  ): Promise<CartSeat[]> {
    return await CartSeat.findAll({
      where: {
        showtimeId,
        ...validLockWhere(),
      },
      attributes: ["seatId", "cartId", "price", "expiresAt"],
      transaction: options?.transaction,
    });
  }

  async findValidByCartAndShowtime(
    cartId: number,
    showtimeId: number,
    options?: { transaction?: Transaction }
  ): Promise<CartSeat[]> {
    return await CartSeat.findAll({
      where: {
        cartId,
        showtimeId,
        ...validLockWhere(),
      },
      attributes: ["seatId", "cartId", "price", "expiresAt"],
      transaction: options?.transaction,
    });
  }

  async deleteExpired(options?: { transaction?: Transaction }): Promise<number> {
    return await CartSeat.destroy({
      where: {
        [Op.or]: [
          { expiresAt: { [Op.lte]: new Date() } },
          { expiresAt: { [Op.is]: null } },
        ],
      },
      transaction: options?.transaction,
    });
  }

  async findValidByCartAndShowtimeWithDetails(
    cartId: number,
    showtimeId: number
  ): Promise<any[]> {
    return await CartSeat.findAll({
      where: {
        cartId,
        showtimeId,
        ...validLockWhere(),
      },
      include: [
        {
          model: (await import("../models/showtime.model")).default,
          as: "showtime",
          attributes: ["id", "movieId", "roomId", "startTime", "endTime", "basePrice"],
        },
        {
          model: (await import("../models/complex/seat.model")).default,
          as: "seat",
          attributes: ["id", "code", "rowLabel", "seatNumber"],
          include: [
            {
              model: (await import("../models/complex/seat-type.model")).default,
              as: "seatType",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      attributes: ["id", "cartId", "showtimeId", "seatId", "price", "lockedAt", "expiresAt"],
    });
  }
}

export default new CartSeatRepository();
