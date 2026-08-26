// app/src/services/function.service.ts

import { IFunctionService } from "./interfaces/function.service.interface";
import repository from "../repositories/funtion.repository";
import AppError from "../error/appError";
import { FunctionDto } from "../dto/funtion/funtion.dto";


/**
 * Servicio de Funciones
 * -------------------
 * Contiene toda la lógica de negocio relacionada con la entidad Function.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre el controlador y el repositorio.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class FunctionService implements IFunctionService {
  
    async findById(id: number): Promise<FunctionDto> {
        const functionData = await repository.findById(id);
        if (!functionData) {
            throw new AppError(404, "La funcion no ha sido encontrada.");
        }

        return {
            id: functionData.id,
            movieId: functionData.movieId,
            roomId: functionData.roomId,
            formatId: functionData.formatId,
            language: functionData.language,
            isSubtitled: functionData.isSubtitled,
            startTime: functionData.startTime,
            endTime: functionData.endTime,
            basePrice: functionData.basePrice,
            availableSeats: functionData.availableSeats,
            isActive: functionData.isActive,
        };
    }

}

export default new FunctionService();
