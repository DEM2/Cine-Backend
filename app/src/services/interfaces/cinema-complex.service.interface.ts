// app/src/services/interfaces/cinema-complex.service.interface.ts

import { CinemaComplexResponseDto } from "../../dto/cinema-complex-response.dto";
import { CreateCinemaComplexDto } from "../../dto/create-cinema-complex.dto";

export interface ICinemaComplexService {
  /**
   * Obtiene todos los complejos de cine.
   */
  findAll(): Promise<CinemaComplexResponseDto[]>;

  /**
   * Crea un nuevo complejo de cine.
   *
   * @param dto - Datos necesarios para la creación.
   */
  create(dto: CreateCinemaComplexDto): Promise<CinemaComplexResponseDto>;
}
