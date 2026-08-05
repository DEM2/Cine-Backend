// app/src/services/interfaces/country.service.interface.ts

import { CountryResponseDto } from "../../dto/country-response.dto";

/**
 * Contrato del Servicio de Países.
 */

export interface ICountryService {

    findAll(): Promise<CountryResponseDto[]>;

}
