// app/src/dto/department-response.dto.ts

/**
 * DTO - Respuesta de Departamento
 * -------------------------------
 * Este DTO representa la información que se expone al cliente
 * al consultar la entidad `Department`, evitando exponer el modelo de base de datos.
 *
 * @property {number} id - Identificador único del departamento.
 * @property {string} name - Nombre del departamento.
 *
 * @example
 * const dto: DepartmentResponseDto = {
 *   id: 1,
 *   name: "Atlantico"
 * };
 */

export interface DepartmentResponseDto {
  /**
   * Identificador único del departamento.
   */
  id: number;

  /**
   * Nombre del departamento.
   */
  name: string;
}
