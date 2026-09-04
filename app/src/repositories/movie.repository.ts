// app/src/repositories/movie.repository.ts

import { Op } from "sequelize";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Showtime from "../models/showtime.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Format from "../models/format.model";
import Genre from "../models/genre.model";
import MovieCast from "../models/movie-cast.model";
import MovieLocation from "../models/movie-location.model";
import { MovieFilterCriteria, ShowtimeSearchCriteria } from "./types/movie-query.types";

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
     * Obtiene las películas aplicando criterios de consulta.
     */
    async findFiltered(criteria: MovieFilterCriteria): Promise<Movie[]> {
        const movieWhere: Record<string, unknown> = {};
        const showtimeWhere: Record<string, unknown> = { isActive: true };
        const { movie, showtime } = criteria;

        if (movie.title) {
            movieWhere.title = { [Op.iLike]: `%${movie.title}%` };
        }
        if (movie.genre) {
            movieWhere.genre = { [Op.iLike]: `%${movie.genre}%` };
        }
        if (movie.rating) {
            movieWhere.rating = movie.rating;
        }
        if (movie.language) {
            movieWhere.language = { [Op.iLike]: `%${movie.language}%` };
        }
        if (movie.premiere !== undefined) {
            movieWhere.premiere = movie.premiere;
        }

        if (showtime.date) {
            const startOfDay = new Date(`${showtime.date}T00:00:00Z`);
            const endOfDay = new Date(`${showtime.date}T23:59:59Z`);
            showtimeWhere.startTime = { [Op.between]: [startOfDay, endOfDay] };
        }
        if (showtime.formatId) {
            showtimeWhere.formatId = showtime.formatId;
        }
        if (showtime.complex) {
            showtimeWhere.complex = { [Op.iLike]: `%${showtime.complex}%` };
        }
        if (showtime.isSoldOut !== undefined) {
            showtimeWhere.isSoldOut = showtime.isSoldOut;
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
            }]
        });
    }

    async findFunctionsByCriteria(criteria: ShowtimeSearchCriteria): Promise<Showtime[]> {
        const startTime: Record<symbol, Date> = {};

        if (criteria.startTimeGt) {
            startTime[Op.gt] = criteria.startTimeGt;
        }
        if (criteria.startTimeGte) {
            startTime[Op.gte] = criteria.startTimeGte;
        }
        if (criteria.startTimeLt) {
            startTime[Op.lt] = criteria.startTimeLt;
        }

        const where: Record<string, unknown> = {
            movieId: criteria.movieId,
            isActive: criteria.isActive,
            startTime,
        };

        if (criteria.onlyWithAvailableSeats) {
            where.availableSeats = { [Op.gt]: 0 };
        }

        if (criteria.roomIds !== undefined) {
            where.roomId = { [Op.in]: criteria.roomIds };
        } else if (criteria.roomId !== undefined) {
            where.roomId = criteria.roomId;
        }

        if (criteria.formatId !== undefined) {
            where.formatId = criteria.formatId;
        }

        if (criteria.language !== undefined) {
            where.language = criteria.language;
        }

        if (criteria.isSubtitled !== undefined) {
            where.isSubtitled = criteria.isSubtitled;
        }

        return await Showtime.findAll({
            where,
            order: [["startTime", "ASC"]],
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

    async findByStatus(status: string): Promise<Movie[]> {
        return await Movie.findAll({
            where: { status },
            order: [["release_date", "ASC"]],
            include: [
                { model: Genre, as: 'genres', attributes: ['name', 'id'], through: { attributes: [] } },
                { model: MovieCast, as: 'cast', attributes: ['id', 'actorName', 'roleName'] },
            ]
        });
    }

    /**
     * Obtiene las películas disponibles en una ciudad específica.
     *
     * El `countryId` se resuelve en el servicio a partir de la ciudad consultada.
     */
    async findAvailableInCity(cityId: number, countryId: number): Promise<Movie[]> {
        return await Movie.findAll({
            include: [
                {
                    model: Genre,
                    as: 'genres',
                    attributes: ['name', 'id'],
                    through: { attributes: [] },
                },
                {
                    model: MovieLocation,
                    as: 'locations',
                    required: true,
                    where: {
                        [Op.or]: [
                            { scope: "COUNTRY", countryId },
                            { scope: "CITY", cityId },
                        ]
                    }
                }
            ]
        });
    }
}

export default new MovieRepository();
