// app/src/services/cinema-complex.service.ts

import { CinemaComplexResponseDto } from "../dto/cinema-complex-response.dto";
import { CreateCinemaComplexDto } from "../dto/create-cinema-complex.dto";
import cinemaComplexRepository from "../repositories/cinema-complex.repository";
import cityRepository from "../repositories/city.repository";
import AppError from "../error/appError";
import { ICinemaComplexService } from "./interfaces/cinema-complex.service.interface";

/**
 * Servicio de Complejos de Cine
 * -------------------------------
 * Contiene toda la lógica de negocio relacionada con la entidad CinemaComplex.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */
class CinemaComplexService implements ICinemaComplexService {
  /**
   * Obtiene todos los complejos de cine.
   */
  async findAll(): Promise<CinemaComplexResponseDto[]> {
    const cinemaComplexes = await cinemaComplexRepository.findAll();

    return cinemaComplexes.map((cinemaComplex) => ({
      id: cinemaComplex.id,
      cityId: cinemaComplex.cityId,
      name: cinemaComplex.name,
      address: cinemaComplex.address,
      isActive: cinemaComplex.isActive,
    }));
  }

  /**
   * Crea un nuevo complejo de cine.
   */
  async create(dto: CreateCinemaComplexDto): Promise<CinemaComplexResponseDto> {
    // Validar que la ciudad exista antes de crear el complejo.
    const city = await cityRepository.findById(dto.cityId);
    if (!city) {
      throw new AppError(404, "Ciudad no encontrada");
    }

    // Asignar isActive por defecto a true si no se envía.
    const isActive = dto.isActive ?? true;

    const cinemaComplex = await cinemaComplexRepository.create({
      cityId: dto.cityId,
      name: dto.name,
      address: dto.address,
      isActive,
    });

    return {
      id: cinemaComplex.id,
      cityId: cinemaComplex.cityId,
      name: cinemaComplex.name,
      address: cinemaComplex.address,
      isActive: cinemaComplex.isActive,
    };
  }
}

export default new CinemaComplexService();
