// app/src/services/department.service.ts

import { DepartmentResponseDto } from "../dto/department-response.dto";
import departmentRepository from "../repositories/department.repository";
import countryRepository from "../repositories/country.repository";
import AppError from "../error/appError";
import { IDepartmentService } from "./interfaces/department.service.interface";

/**
 * Servicio de Departamentos
 * ---------------------------
 * Contiene toda la lógica de negocio relacionada con la entidad Department.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre uno o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class DepartmentService implements IDepartmentService {

    async findByCountryId(countryId: number): Promise<DepartmentResponseDto[]> {

        // Valida que el país exista antes de consultar sus departamentos.
        const country = await countryRepository.findById(countryId);
        if (!country) {
            throw new AppError(404, "País no encontrado");
        }

        const departments = await departmentRepository.findByCountryId(countryId);
        return departments.map(department => ({
            id: department.id,
            name: department.name
        }));

    }

}

export default new DepartmentService();
