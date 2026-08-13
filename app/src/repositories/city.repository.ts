// app/src/repositories/city.repository.ts

import City from "../models/geo_locations/city.model";
import { ICityRepository } from "./interfaces/city.repository.interface";

class CityRepository implements ICityRepository {

    async findByDepartmentId(departmentId: number): Promise<City[]> {

        return await City.findAll({
            where: { departmentId }
        });

    }

     /**
     * Obtiene una ciudad por su identificador.
     */
    async findById(id: number): Promise<City | null> {

        return await City.findByPk(id);

    }

}

export default new CityRepository();