// app/src/dto/cinema-complex-response.dto.ts

/**
 * DTO - Respuesta de Complejo de Cine
 * ------------------------------------
 * Este DTO representa la información que se expone al cliente
 * al consultar la entidad `CinemaComplex`, evitando exponer el modelo de base de datos.
 *
 * @property {number} id - Identificador único del complejo de cine.
 * @property {number} cityId - Identificador de la ciudad a la que pertenece.
 * @property {string} name - Nombre del complejo de cine.
 * @property {string} address - Dirección del complejo de cine.
 * @property {boolean} isActive - Indica si el complejo de cine está activo.
 *
 * @example
 * const dto: CinemaComplexResponseDto = {
 *   id: 1,
 *   cityId: 1,
 *   name: "Cine Colombia",
 *   address: "Calle 123 # 45-67",
 *   isActive: true
 * };
 */

export interface CinemaComplexResponseDto {
  /**
   * Identificador único del complejo de cine.
   */
  id: number;

  /**
   * Identificador de la ciudad a la que pertenece el complejo.
   */
  cityId: number;

  /**
   * Nombre del complejo de cine.
   */
  name: string;

  /**
   * Dirección del complejo de cine.
   */
  address: string;

  /**
   * Indica si el complejo de cine está activo.
   */
  isActive: boolean;
}