// app/src/services/function.service.ts

import { IFunctionService } from "./interfaces/function.service.interface";
import repository from "../repositories/funtion.repository";
import AppError from "../error/appError";
import { FunctionDto } from "../dto/funtion/funtion.dto";
import { FunctionPriceDto } from "../dto/funtion/function-price.dto";


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

    async getPrice(id: number): Promise<FunctionPriceDto> {
        const functionData = await repository.findByIdWithPriceDetails(id);

        if (!functionData) {
            throw new AppError(404, "La función no ha sido encontrada.");
        }

        if (!functionData.isActive) {
            throw new AppError(404, "La función no está disponible.");
        }

        if (new Date(functionData.startTime).getTime() <= Date.now()) {
            throw new AppError(400, "No se puede seleccionar una función que ya inició.");
        }

        if (!functionData.format || !functionData.room) {
            throw new AppError(400, "La función no tiene formato o sala configurados.");
        }

        const basePrice = Number(functionData.basePrice);
        const formatExtraCharge = Number(functionData.format.extraCharge);
        const roomExtraCharge = Number(functionData.room.extraCharge);
        const totalExtraCharges = formatExtraCharge + roomExtraCharge;

        return {
            functionId: functionData.id,
            currency: "COP",
            basePrice,
            format: {
                id: functionData.format.id,
                name: functionData.format.name,
                extraCharge: formatExtraCharge,
            },
            room: {
                id: functionData.room.id,
                name: functionData.room.name,
                extraCharge: roomExtraCharge,
            },
            totalExtraCharges,
            finalPrice: basePrice + totalExtraCharges,
        };
    }

}

export default new FunctionService();
