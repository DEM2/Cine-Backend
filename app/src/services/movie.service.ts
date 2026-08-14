// app/src/services/movie.service.ts

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import repository from "../repositories/movie.repository";
import AppError from "../error/appError";
import Movie, { MovieCreationAttributes } from "../models/movie.model";

import { IMovieService } from "../services/interfaces/movie.service.interface"
import Showtime from "../models/showtime.model";

/**
 * Servicio de Movie
 * -----------------
 * Contiene toda la lógica de negocio relacionada con la entidad Movie.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre el controlador y el repositorio.
 *  - Mantener al controlador libre de lógica de negocio.
 * 
 */

class MovieService implements IMovieService {

    async create(dto: CreateMovieDto): Promise<Movie> {

        if (!dto.genres || dto.genres.length === 0) {
            throw new AppError(400, "Debes asignar al menos un género a la película.");
        }

        // Verificar si ya existe una película con el mismo título
        const existingMovie = await repository.findByTitle(dto.title);

        if (existingMovie) {
            throw new AppError(400, "La película ya se encuentra registrada.");
        }

        const { genres, ...movieData } = dto;
        return await repository.create(movieData as MovieCreationAttributes, genres);
    }

    async findAll(): Promise<Movie[]> {
        return await repository.findAll();
    }

    async findById(id: number): Promise<Movie> {
        const movie = await repository.findById(id);

        if (!movie) {
            throw new AppError(404, "La película no encontrada.");
        }

        return movie;
    }

    async findFunctions(movieId: number): Promise<Showtime[]> {
        await this.findById(movieId);
        const showtimes = await repository.findFunctionsByMovieId(movieId);
        if (!showtimes) {
            throw new AppError(404, "No se encontraron funciones para la película.");
        }
        return showtimes;
    }

    async findRecommendedMovies(id: number): Promise<Movie[]> {
        const movie = await this.findById(id) ;

        const genres = (movie as any).genres as {id: number}[] | undefined;
        const genreIds = genres?.map(genre => genre.id) ?? [];

        if (genreIds.length === 0) {
            throw new AppError(400, "La película no tiene géneros asignados.");
        }
        return await repository.findRecommendedMovies(movie.id, genreIds);
    }
}

export default new MovieService();