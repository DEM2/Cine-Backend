// app/src/repositories/movie.repository.ts

import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Showtime from "../models/showtime.model";
import Format from "../models/format.model";
import { Op } from "sequelize";


/**
 * Repositorio de Películas
 * ------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Movie.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class MovieRepository implements IMovieRepository {
    
    /**
     * Obtiene las películas con funciones activas en una fecha específica.
     */
    async findToday(date: string): Promise<Movie[]> {
        return await Movie.findAll({
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: { 
                        isActive: true,
                        date: date
                    },
                    required: true,
                }
            ]
        });
    }

    /**
     * Obtiene las películas con funciones activas en un rango de fechas.
     */
    async findWeekly(startDate: string, endDate: string): Promise<Movie[]> {
        return await Movie.findAll({
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: { 
                        isActive: true,
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    required: true,
                }
            ]
        });
    }

    /**
     * Obtiene las películas aplicando filtros combinados.
     */
    async findFiltered(filters: MovieFilterDto): Promise<Movie[]> {
        const movieWhere: any = {};
        const showtimeWhere: any = { isActive: true };

        // Filtros de película
        if (filters.title) {
            movieWhere.title = { [Op.iLike]: `%${filters.title}%` };
        }
        if (filters.genre) {
            movieWhere.genre = { [Op.iLike]: `%${filters.genre}%` };
        }
        if (filters.rating) {
            movieWhere.rating = filters.rating;
        }
        if (filters.language) {
            movieWhere.language = { [Op.iLike]: `%${filters.language}%` };
        }
        if (filters.premiere !== undefined) {
            movieWhere.premiere = filters.premiere;
        }

        // Filtros de función
        if (filters.date) {
            showtimeWhere.date = filters.date;
        }
        if (filters.formatId) {
            showtimeWhere.formatId = filters.formatId;
        }
        if (filters.complex) {
            showtimeWhere.complex = { [Op.iLike]: `%${filters.complex}%` };
        }
        if (filters.available !== undefined) {
            showtimeWhere.isSoldOut = !filters.available;
        }

        return await Movie.findAll({
            where: movieWhere,
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: showtimeWhere,
                    required: true,
                    include: [
                        {
                            model: Format,
                            as: "format",
                            required: false
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Crea una nueva película.
     */
    async create(data: MovieCreationAttributes): Promise<Movie> {
        return await Movie.create(data);
    }

    /**
     * Obtiene todas las películas.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll({
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: { isActive: true },
                    required: true,
                }
            ]
        });
    }

    /**
     * Busca una película por su título.
     */
    async findByTitle(title: string): Promise<Movie | null> {
        return await Movie.findOne({ where: { title } });
    }

}

export default new MovieRepository();