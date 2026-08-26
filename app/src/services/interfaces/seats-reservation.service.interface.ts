import CartSeat from "../../models/reservations/cart-seat.model";
import { LockSeatsDto } from "../../dto/reservations/lock-seats.dto";
import { ReleaseSeatsDto } from "../../dto/reservations/release-seats.dto";

/**
 * DTO de respuesta para el mapa de sillas de una función
 * (`GET /functions/:id/seats`).
 */
export interface ShowtimeSeatDto {
  id: number;
  code: string;
  rowLabel: string;
  seatNumber: number;
  seatType: { id: number; code: string; name: string } | null;
  status: "available" | "locked";
  /**
   * Carrito que mantiene el lock de la silla. `null` si está disponible.
   * El frontend compara con su propio `cartId` para distinguir
   * "seleccionada por mí" de "ocupada por otro".
   */
  lockedByCartId: number | null;
  price: number;
}

/**
 * Resultado del bloqueo de sillas (`POST /reservations/lock-seats`).
 */
export interface LockSeatsResult {
  seats: CartSeat[];
  total: number;
}

/**
 * Contrato del Servicio de Reservas.
 */
export interface IReservationService {

  /**
   * Obtiene el mapa de sillas habilitadas de una función con su estado
   * (disponible o bloqueada) y su precio calculado.
   */
  getShowtimeSeats(showtimeId: number): Promise<ShowtimeSeatDto[]>;

  /**
   * Bloquea un conjunto de sillas de una función para un carrito.
   */
  lockSeats(dto: LockSeatsDto): Promise<LockSeatsResult>;

  /**
   * Libera un conjunto de sillas previamente bloqueadas por un carrito.
   */
  releaseSeats(dto: ReleaseSeatsDto): Promise<number>;
}