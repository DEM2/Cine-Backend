
/**
 * DTO - Respuesta de Complejo de Cine
 * ------------------------------------
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
 *   name: "Multicine Viva",
 *   address: "Carrera 51B #87-50",
 *   isActive: true
 * };
 */

export interface CinemaComplexResponseDto {
  id: number;
  cityId: number;
  name: string;
  address: string;
  isActive: boolean;
}