// app/src/repositories/movie.repository.ts

import { Op } from "sequelize";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Showtime from "../models/showtime.model";
import Room from "../models/complex/room.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Genre from "../models/genre.model";
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
}

export default new MovieRepository();
