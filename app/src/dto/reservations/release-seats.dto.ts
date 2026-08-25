/**
 * DTO - Liberación de Sillas (release-seats)
 * ------------------------------------------
 * Define el contrato de datos para liberar un conjunto de sillas de una
 * función previamente bloqueadas por un carrito.
 *
 * @property {number} cartId - Identificador del carrito (tabla `carts`, creada en otra rama).
 * @property {number} showtimeId - Identificador de la función (`showtimes.id`).
 * @property {number[]} seatIds - Sillas a liberar (`seats.id`).
 */
export interface ReleaseSeatsDto {
  cartId: number;
  showtimeId: number;
  seatIds: number[];
}