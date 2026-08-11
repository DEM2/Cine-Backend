// app/src/repositories/movie.repository.ts

import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import Showtime from "../models/showtime.model";


/**
 * Repositorio de Películas
 * ------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Movie.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class MovieRepository implements IMovieRepository {
    findToday(date: string): Promise<Movie[]> {
        throw new Error("Method not implemented.");
    }
    findWeekly(startDate: string, endDate: string): Promise<Movie[]> {
        throw new Error("Method not implemented.");
    }
    findFiltered(filters: MovieFilterDto): Promise<Movie[]> {
        throw new Error("Method not implemented.");
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