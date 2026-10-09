/**
 * Datos públicos de una función de cine (Showtime).
 *
 * Este DTO es la respuesta del endpoint `GET /api/functions/:id`.
 * No representa el modelo de Sequelize: define únicamente los datos que la
 * API entregará al cliente.
 */
export interface FunctionDto {
  /** Identificador numérico de la función. */
  id: number;

  /** Identificador de la película programada. */
  movieId: number;

  /** Identificador de la sala donde se proyecta. */
  roomId: number;

  /** Identificador del formato de proyección, por ejemplo 2D o 3D. */
  formatId: number;

  language: string;
  isSubtitled: boolean;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  availableSeats: number;
  isActive: boolean;
}
