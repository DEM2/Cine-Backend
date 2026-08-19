// app/src/dto/set-user-location.dto.ts

/**
 * DTO - Selección de Ubicación
 * --------------------------------------
 */

/**
 * Objeto de transferencia de datos para la selección de ubicación.
 *
 * @property {number} city_id - Identificador de la ciudad seleccionada (FK -> cities).
 *
 * @example
 * const dto: SetUserLocationDto = {
 *   city_id: 1
 * };
 */
export interface SetUserLocationDto {

    /**
     * Identificador de la ciudad seleccionada por el visitante.
     */
    city_id: number;

}