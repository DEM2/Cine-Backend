import { Transaction } from "sequelize";
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
   * Obtiene todos los bloqueos existentes de una función.
   */
  findLockedByShowtime(showtimeId: number): Promise<CartSeat[]>;
}