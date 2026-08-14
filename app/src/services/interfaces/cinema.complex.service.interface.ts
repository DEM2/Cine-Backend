import { CinemaComplexResponseDto } from "../../dto/cinema.complex.response.dto";

export interface ICinemaComplexService {

    /**
     * Obtiene todos los complejos de cine activos.
     */
    findAllActive(): Promise<CinemaComplexResponseDto[]>;

    /**
     * Obtiene los complejos de cine activos de una ciudad.
     *
     * @param cityId - Identificador de la ciudad.
     */
    findByCityId(cityId: number): Promise<CinemaComplexResponseDto[]>;

}