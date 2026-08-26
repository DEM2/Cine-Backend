// app/src/repositories/movie.repository.ts

import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import { cast, Op } from "sequelize";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Showtime from "../models/showtime.model";
import Room from "../models/complex/room.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Format from "../models/format.model";


import Genre from "../models/genre.model";
import MovieCast from "../models/movie-cast.model";
import MovieLocation from "../models/movie-location.model";
import { idText } from "typescript";
import { FunctionFilterDto } from "../dto/funtion/funtion-filter.dto";

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

    async findFunctionsByMovieId(
        movieId: number,
        filters: FunctionFilterDto = {}
    ): Promise<Showtime[]> {
        const now = new Date();

        const limitDate = new Date(now);
        limitDate.setDate(limitDate.getDate() + 8);
        limitDate.setHours(0, 0, 0, 0);

        const startTime: Record<symbol, Date> = {
            [Op.gt]: now,
            [Op.lt]: limitDate,
        };

        if (filters.date) {
            const startOfDay = new Date(`${filters.date}T00:00:00-05:00`);
            const nextDay = new Date(`${filters.date}T00:00:00-05:00`);
            nextDay.setDate(nextDay.getDate() + 1);

            startTime[Op.gte] = startOfDay;
            startTime[Op.lt] = nextDay;
        }

        const where: any = {
            movieId,
            isActive: true,
            availableSeats: { [Op.gt]: 0 },
            startTime,
        };

        if (filters.roomId !== undefined) {
            where.roomId = filters.roomId;
        }

        if (filters.formatId !== undefined) {
            where.formatId = filters.formatId;
        }

        if (filters.language !== undefined) {
            where.language = filters.language;
        }

        if (filters.isSubtitled !== undefined) {
            where.isSubtitled = filters.isSubtitled;
        }

        if (filters.complexId !== undefined) {
            const rooms = await Room.findAll({
                where: { complexId: filters.complexId },
                attributes: ["id"],
            });

            where.roomId = { [Op.in]: rooms.map((room) => room.id) };
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

/**
 * Obtiene las películas disponibles en una ciudad específica.
 *
 * Una película está disponible en la ciudad cuando:
 *  - Tiene una ubicación con scope 'CITY' apuntando a esa ciudad, o
 *  - Tiene una ubicación con scope 'COUNTRY' para el país de esa ciudad
 *    (disponibilidad nacional).
 *
 * El `countryId` se resuelve en el servicio a partir de la ciudad consultada.
 *
 * Detalle Sequelize: el `where` dentro del include genera un INNER JOIN
 * con condición sobre `movie_locations`, no sobre la tabla principal.
 * `required: true` garantiza que SOLO regresen películas que tengan al
 * menos una fila de ubicación que cumpla la condición.
 */
async findAvailableInCity(cityId: number, countryId: number): Promise<Movie[]> {
    return await Movie.findAll({
        include: [
            {
                // Géneros de cada película (N:M a través de movie_genres).
                model: Genre,
                as: 'genres',
                attributes: ['name', 'id'],
                through: { attributes: [] }, // oculta las columnas de la tabla intermedia
            },
            {
                // Filtro por distribución geográfica.
                model: MovieLocation,
                as: 'locations',
                required: true, // INNER JOIN: sin ubicación compatible → fuera
                where: {
                    [Op.or]: [
                        // Caso 1: distribución nacional que cubre el país de la ciudad.
                        { scope: "COUNTRY", countryId },
                        // Caso 2: distribución puntual para exactamente esta ciudad.
                        { scope: "CITY", cityId },
                    ]
                }
            }
        ]
    });
}

}

export default new MovieRepository();
