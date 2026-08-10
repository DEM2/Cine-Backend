// app/src/repositories/interfaces/city.repository.interface.ts

import City from "../../models/city.model";

export interface ICityRepository {

    /**
     * Obtiene todas las ciudades de un departamento.
     *
     * @param departmentId - Identificador del departamento.
     */
    findByDepartmentId(departmentId: number): Promise<City[]>;

}