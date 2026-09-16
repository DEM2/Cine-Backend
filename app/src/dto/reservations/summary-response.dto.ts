/**
 * DTO - Respuesta del Resumen de Reserva (GET /reservations/summary)
 * -----------------------------------------------------------------
 * Estructura de respuesta que contiene el resumen completo de las
 * sillas bloqueadas por un carrito para una función específica.
 */

export interface SummarySeatDto {
  id: number;
  code: string;
  rowLabel: string;
  seatNumber: number;
  seatType: string;
  price: number;
}

export interface SummaryShowtimeDto {
  id: number;
  movieId: number;
  roomId: number;
  startTime: Date;
  endTime: Date;
  basePrice: number;
}

export interface SummaryResponseDto {
  cartId: number;
  showtime: SummaryShowtimeDto;
  seats: SummarySeatDto[];
  totalSeats: number;
  totalAmount: number;
  expiresAt: Date | null;
}
