// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie, { MovieCreationAttributes } from "../../models/movie.model";
import { MovieFilterDto } from "../../dto/movie/movie-filter.dto";

/**
 * Contrato del Repositorio de Películas
 * -------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IMovieRepository {

    /**
     * Crea una película.
     */
    create(data: MovieCreationAttributes): Promise<Movie>;

    /**
     * Obtiene todas las películas.
     */
    findAll(): Promise<Movie[]>;

    /**
     * Busca una película por su título.
     */
    findByTitle(title: string): Promise<Movie | null>;

    /**
     * Obtiene las películas con funciones activas en una fecha específica.
     */
    findToday(date: string): Promise<Movie[]>;

    /**
     * Obtiene las películas con funciones activas en un rango de fechas.
     */
    findWeekly(startDate: string, endDate: string): Promise<Movie[]>;

    /**
     * Obtiene las películas aplicando los filtros recibidos del cliente.
     */
    findFiltered(filters: MovieFilterDto): Promise<Movie[]>;
}