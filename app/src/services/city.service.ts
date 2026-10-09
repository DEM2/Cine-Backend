// app/src/services/city.service.ts

import { CityResponseDto } from "../dto/city-response.dto";
import cityRepository from "../repositories/city.repository";
import departmentRepository from "../repositories/department.repository";
import AppError from "../error/appError";
import { ICityService } from "./interfaces/city.service.interface";

class CityService implements ICityService {

    async findByDepartmentId(departmentId: number): Promise<CityResponseDto[]> {

        const department = await departmentRepository.findById(departmentId);
        if (!department) {
            throw new AppError(404, "Departamento no encontrado");
        }

        const cities = await cityRepository.findByDepartmentId(departmentId);
        return cities.map(city => ({
            id: city.id,
            name: city.name,
            isActive: city.isActive
        }));

    }

}

export default new CityService();