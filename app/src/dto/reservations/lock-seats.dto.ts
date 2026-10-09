/**
 * DTO - Bloqueo de Sillas (lock-seats)
 *
 * @property {number} cartId - Identificador del carrito (tabla `carts`, creada en otra rama).
 * @property {number} showtimeId - Identificador de la función (`showtimes.id`).
 * @property {number[]} seatIds - Sillas a bloquear (`seats.id`).
 */
export interface LockSeatsDto {
  cartId: number;
  showtimeId: number;
  seatIds: number[];
}