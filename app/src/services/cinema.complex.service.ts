import { CinemaComplexResponseDto } from "../dto/cinema.complex.response.dto";
import cinemaComplexRepository from "../repositories/cinema.complex.repository";
import cityRepository from "../repositories/city.repository";
import AppError from "../error/appError";
import { ICinemaComplexService } from "./interfaces/cinema.complex.service.interface";

class CinemaComplexService implements ICinemaComplexService {

    async findAllActive(): Promise<CinemaComplexResponseDto[]> {

        const complexes = await cinemaComplexRepository.findAllActive();

        return complexes.map(complex => ({
            id: complex.id,
            cityId: complex.cityId,
            name: complex.name,
            address: complex.address,
            isActive: complex.isActive
        }));

    }

    async findByCityId(cityId: number): Promise<CinemaComplexResponseDto[]> {

        const city = await cityRepository.findById(cityId);
        if (!city) {
            throw new AppError(404, "Ciudad no encontrada");
        }

        const complexes = await cinemaComplexRepository.findByCityId(cityId);

        return complexes.map(complex => ({
            id: complex.id,
            cityId: complex.cityId,
            name: complex.name,
            address: complex.address,
            isActive: complex.isActive
        }));

    }

}

export default new CinemaComplexService();