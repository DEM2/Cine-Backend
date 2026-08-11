// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Showtime from "../models/showtime.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";

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
    async create(data: MovieCreationAttributes): Promise<Movie> {
        return await Movie.create(data);
    }

    /**
     * Obtiene todas las películas.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll();
    }

    async findById(id: number): Promise<Movie | null> {
        return await Movie.findByPk(id);
    }

    /**
     * Busca una película por su título.
     */
    async findByTitle(title: string): Promise<Movie | null> {
        return await Movie.findOne({ where: { title } });
    }

    async findFunctionsByMovieId(movieId: number): Promise<Showtime[]> {
        return await Showtime.findAll({ where: { movieId } });
    }

}

export default new MovieRepository();