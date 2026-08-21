// app/src/services/interfaces/movie.service.interface.ts

import movie from "../../models/movie.model";
import { CreateMovieDto } from "../../dto/movie/create-movie.dto";
import { MovieFilterDto } from "../../dto/movie/movie-filter.dto";

/**
 * Contrato del Servicio de Películas.
 */

export interface IMovieService {
    
    create(dto: CreateMovieDto): Promise<movie>;

    findAll(): Promise<movie[]>;

    /**
     * Películas con funciones activas para la fecha de hoy.
     */
    getToday(): Promise<movie[]>;

    /**
     * Películas con funciones activas en los próximos 7 días.
     */
    getWeekly(): Promise<movie[]>;

    /**
     * Películas que cumplen los filtros recibidos.
     */
    getFiltered(filters: MovieFilterDto): Promise<movie[]>;

}