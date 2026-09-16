import { Op, Transaction } from "sequelize";
import CartSeat, { CartSeatCreationAttributes } from "../../models/reservations/cart-seat.model";

/**
 * Contrato del Repositorio de Sillas Bloqueadas en Carrito (CartSeat)
 * ---------------------------------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad `CartSeat`.
 */

export interface ICartSeatRepository {

  /**
   * Crea un conjunto de bloqueos (filas de `cart_seats`) de forma masiva.
   * Puede ejecutarse dentro de una transacción para garantizar atomicidad.
   */
  lockSeats(rows: CartSeatCreationAttributes[], options?: { transaction?: Transaction }): Promise<CartSeat[]>;

  /**
   * Elimina los bloqueos de un carrito para las sillas indicadas de una función.
   * Devuelve la cantidad de filas eliminadas.
   */
  releaseSeats(
    cartId: number,
    showtimeId: number,
    seatIds: number[]
  ): Promise<number>;

  /**
   * Obtiene los bloqueos VIGENTES (no expirados) de una función.
   * Las filas con `expiresAt` nulo (legacy) o vencido se consideran expiradas.
   * Puede ejecutarse dentro de una transacción.
   */
  findLockedByShowtime(
    showtimeId: number,
    options?: { transaction?: Transaction }
  ): Promise<CartSeat[]>;

  /**
   * Obtiene los bloqueos vigentes de un carrito para una función.
   * Puede ejecutarse dentro de una transacción.
   */
  findValidByCartAndShowtime(
    cartId: number,
    showtimeId: number,
    options?: { transaction?: Transaction }
  ): Promise<CartSeat[]>;

  /**
   * Elimina físicamente todos los bloqueos expirados (o legacy sin expiración).
   * Usado por el cronjob de purga (RN-040) y como higiene al bloquear.
   */
  deleteExpired(options?: { transaction?: Transaction }): Promise<number>;

  /**
   * Obtiene los bloqueos vigentes de un carrito para una función con
   * los datos completos de la función (Showtime) y la silla (Seat).
   * Usado para el resumen de reserva (GET /reservations/summary).
   */
  findValidByCartAndShowtimeWithDetails(
    cartId: number,
    showtimeId: number
  ): Promise<any[]>;
}
