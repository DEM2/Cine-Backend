// app/src/repositories/interfaces/country.repository.interface.ts

import Country from "../../models/geo_locations/country.model";

/**
 * Contrato del Repositorio de Países
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Country.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface ICountryRepository {

    /**
     * Obtiene todos los países.
     */
    findAll(): Promise<Country[]>;

    /**
     * Obtiene un país por su identificador.
     *
     * @param id - Identificador del país.
     */
    findById(id: number): Promise<Country | null>;

}
