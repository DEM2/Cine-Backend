// app/src/services/country.service.ts

import { CountryResponseDto } from "../dto/country-response.dto";
import repository from "../repositories/country.repository";
import { ICountryService } from "./interfaces/country.service.interface";

/**
 * Servicio de Países
 * -------------------
 * Contiene toda la lógica de negocio relacionada con la entidad Country.
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

class CountryService implements ICountryService {

    async findAll(): Promise<CountryResponseDto[]> {
        const countries = await repository.findAll();
        return countries.map(country => ({
            id: country.id,
            name: country.name
        }));
    }

}

export default new CountryService();
