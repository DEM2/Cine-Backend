// app/src/repositories/interfaces/department.repository.interface.ts

import Department from "../../models/department.model";

/**
 * Contrato del Repositorio de Departamentos
 * ------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Department.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IDepartmentRepository {

    /**
     * Obtiene todos los departamentos de un país.
     *
     * @param countryId - Identificador del país.
     */
    findByCountryId(countryId: number): Promise<Department[]>;

}
