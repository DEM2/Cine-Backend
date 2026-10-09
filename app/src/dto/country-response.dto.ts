// app/src/dto/country-response.dto.ts

/**
 * DTO - Respuesta de País
 * -----------------------
 * Este DTO representa la información que se expone al cliente
 * al consultar la entidad `Country`, evitando exponer el modelo de base de datos.
 *
 * @property {number} id - Identificador único del país.
 * @property {string} name - Nombre del país.
 *
 * @example
 * const dto: CountryResponseDto = {
 *   id: 1,
 *   name: "Colombia"
 * };
 */

export interface CountryResponseDto {
  /**
   * Identificador único del país.
   */
  id: number;

  /**
   * Nombre del país.
   */
  name: string;
}
