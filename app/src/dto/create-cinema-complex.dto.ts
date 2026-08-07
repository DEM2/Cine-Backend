// app/src/dto/create-cinema-complex.dto.ts

/**
 * DTO - Creación de Complejo de Cine
 * -----------------------------------
 * Este DTO representa la información necesaria para crear un nuevo complejo de cine.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 *
 * @property {number} cityId - Identificador de la ciudad a la que pertenece el complejo.
 * @property {string} name - Nombre del complejo de cine.
 * @property {string} address - Dirección del complejo de cine.
 * @property {boolean} [isActive] - Indica si el complejo de cine está activo (opcional, por defecto `true`).
 *
 * @example
 * const dto: CreateCinemaComplexDto = {
 *   cityId: 1,
 *   name: "Cine Colombia",
 *   address: "Calle 123 # 45-67"
 * };
 */

export interface CreateCinemaComplexDto {
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
   * Si no se envía, se asigna `true` por defecto.
   */
  isActive?: boolean;
}