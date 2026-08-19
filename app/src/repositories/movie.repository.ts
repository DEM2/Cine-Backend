// app/src/repositories/movie.repository.ts

import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import { cast, Op } from "sequelize";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Showtime from "../models/showtime.model";
import Format from "../models/format.model";


import Genre from "../models/genre.model";
import MovieCast from "../models/movie-cast.model";
import { idText } from "typescript";

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
        const startOfDay = new Date(`${date}T00:00:00Z`);
        const endOfDay = new Date(`${date}T23:59:59Z`);
        
        return await Movie.findAll({
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: { 
                        isActive: true,
                        startTime: {
                            [Op.between]: [startOfDay, endOfDay]
                        }
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
        const startDateTime = new Date(`${startDate}T00:00:00Z`);
        const endDateTime = new Date(`${endDate}T23:59:59Z`);
        
        return await Movie.findAll({
            subQuery: false,
            include: [
                {
                    model: Showtime,
                    as: "showtimes",
                    where: { 
                        isActive: true,
                        startTime: {
                            [Op.between]: [startDateTime, endDateTime]
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
            const startOfDay = new Date(`${filters.date}T00:00:00Z`);
            const endOfDay = new Date(`${filters.date}T23:59:59Z`);
            showtimeWhere.startTime = { [Op.between]: [startOfDay, endOfDay] };
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
                    required: false,
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
    async create(data: MovieCreationAttributes, genreIds: number[]): Promise<Movie> {
        const movie = await Movie.create(data);
        await (movie as any).setGenres(genreIds);
        return movie;
    }

    /**
     * Obtiene todas las películas.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll({
            // subQuery: false,
            // include: [
            //     {
            //         model: Showtime,
            //         as: "showtimes",
            //         where: { isActive: true },
            //         required: false,
            //     }
            // ]
            // tiempo de las movies agregar 
            include: [{
                model: Genre,
                as: 'genres',
                attributes: ['name', 'id'],
                through: { attributes: [] },
            },
            {
                model: MovieCast,
                as: 'cast',
                attributes: ['id', 'actorName', 'roleName'],
            }]
        });
    }

    async findById(id: number): Promise<Movie | null> {
        return await Movie.findByPk(id, {
            include: [{
                model: Genre,
                as: 'genres',
                attributes: ['name','id'],
                through: { attributes: [] },
            },
            {
                model: MovieCast,
                as: 'cast',
                attributes: ['id', 'actorName', 'roleName'],
            }]
        });
    }

    /**
     * Busca una película por su título.
     */
    async findByTitle(title: string): Promise<Movie | null> {
        return await Movie.findOne({ 
            where: { title },
            include: [{
                model: Genre,
                    as: 'genres',
                    attributes: ['name'],
                    through: { attributes: [] },
                }
            ]
        });
    }

    async findFunctionsByMovieId(movieId: number): Promise<Showtime[]> {
        return await Showtime.findAll({ 
            where: { movieId }
        });
    }

    async findRecommendedMovies(id: number, genreIds: number[]): Promise<Movie[]> {
        return await Movie.findAll({
            where: {
                id: { [Op.ne]: id },
            },
            include: [
                {
                    model: Genre,
                    as: 'genres',
                    attributes: ['name'],
                    through: { attributes: [] },
                    where: {
                        id: { [Op.in]: genreIds }
                    }
                }
            ]
        });
    }

async findUpcoming(): Promise<Movie[]> {
    return await Movie.findAll({
        where: { status: "UPCOMING" },
        order: [["release_date", "ASC"]],
        include: [
            { model: Genre, as: 'genres', attributes: ['name', 'id'], through: { attributes: [] } },
            { model: MovieCast, as: 'cast', attributes: ['id', 'actorName', 'roleName'] },
        ]
    });
}

}

export default new MovieRepository();