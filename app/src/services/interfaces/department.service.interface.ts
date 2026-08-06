// app/src/services/interfaces/department.service.interface.ts

import { DepartmentResponseDto } from "../../dto/department-response.dto";

/**
 * Contrato del Servicio de Departamentos.
 */

export interface IDepartmentService {

    /**
     * Obtiene todos los departamentos de un país.
     *
     * @param countryId - Identificador del país.
     */
    findByCountryId(countryId: number): Promise<DepartmentResponseDto[]>;

}
