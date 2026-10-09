/**
 * Configuración de bloqueo temporal de sillas 
 * -----------------------------------------------------
 * Lee las variables de entorno con valores por defecto seguros:
 *  - SEAT_LOCK_TTL_MINUTES      : minutos de vigencia del bloqueo (default 10).
 *  - MAX_TICKETS_PER_SHOWTIME   : máximo de entradas por carrito/función (default 5).
 */

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const SEAT_LOCK_TTL_MINUTES = parsePositiveInt(
  process.env.SEAT_LOCK_TTL_MINUTES, 10
);

export const MAX_TICKETS_PER_SHOWTIME = parsePositiveInt(
  process.env.MAX_TICKETS_PER_SHOWTIME, 5
);
