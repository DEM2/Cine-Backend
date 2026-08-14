// app/src/repositories/movie.repository.ts

import { Op } from "sequelize";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Showtime from "../models/showtime.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Genre from "../models/genre.model";

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
                attributes: ['name'],
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

    async findFunctionsByMovieId(movieId: number): Promise<Showtime[]> {
        return await Showtime.findAll({ 
            where: { movieId }, 
            include: [
                {
                    model: Genre,
                    as: 'genres',
                    attributes: ['name'],
                    through: { attributes: [] },
                }
            ]
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