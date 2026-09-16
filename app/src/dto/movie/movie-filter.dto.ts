/**
 * DTO de filtros de películas
 * ----------------------------
 * Representa los parámetros de consulta aceptados por `GET /api/movies/filtres`.
 *
 * Los campos alineados a `Movie` (title, genre, rating, language, premiere)
 * se aplican sobre la tabla `movies`; los campos de función (date, formatId,
 * complex, available) se aplican sobre la tabla `showtimes`.
 */

export interface MovieFilterDto {

  /** Título (búsqueda parcial, insensible a mayúsculas). */
  title?: string;

  /** Fecha exacta de la función (YYYY-MM-DD). */
  date?: string;

  /** Género (búsqueda parcial, insensible a mayúsculas). */
  genre?: string;

  /** Clasificación (A, B, B15, C...). */
  rating?: string;

  /** Idioma original. */
  language?: string;

  /** Formato de la función (2D, 3D, IMAX...). */
  formatId?: number;

  /** Complejo donde se proyecta la función. */
  complex?: string;

  /** Solo estrenos (columna premiere de movies). */
  premiere?: boolean;

  /** Solo funciones con disponibilidad (isSoldOut = false). */
  available?: boolean;
}