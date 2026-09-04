// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie, { MovieCreationAttributes } from "../../models/movie.model";
import Showtime from "../../models/showtime.model";
import { MovieFilterCriteria, ShowtimeSearchCriteria } from "../types/movie-query.types";

/**
 * Contrato del Repositorio de Películas
 * -------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IMovieRepository {

    /**
     * Crea una película y asocia sus géneros (N:M).
     */
    create(data: MovieCreationAttributes, genreIds: number[]): Promise<Movie>;

    /**
     * Obtiene todas las películas.
     */
    findAll(): Promise<Movie[]>;

    /**
     * Busca una película por su id.
     */
    findById(id: number): Promise<Movie | null>;

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
     * Obtiene las películas aplicando criterios de consulta ya resueltos.
     */
    findFiltered(criteria: MovieFilterCriteria): Promise<Movie[]>;

    /**
     * Obtiene funciones de una película según criterios de búsqueda.
     */
    findFunctionsByCriteria(criteria: ShowtimeSearchCriteria): Promise<Showtime[]>;

    /**
     * Obtiene películas recomendadas por géneros compartidos.
     */
    findRecommendedMovies(id: number, genreIds: number[]): Promise<Movie[]>;

    /**
     * Obtiene películas filtradas por estado.
     */
    findByStatus(status: string): Promise<Movie[]>;

    /**
     * Obtiene las películas disponibles en una ciudad (scope CITY de esa
     * ciudad o scope COUNTRY del país al que pertenece).
     */
    findAvailableInCity(cityId: number, countryId: number): Promise<Movie[]>;
}
