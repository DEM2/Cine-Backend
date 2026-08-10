// app/src/services/movie.service.ts

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import repository from "../repositories/movie.repository";
import AppError from "../error/appError";
import Movie from "../models/movie.model";

import {IMovieService } from "../services/interfaces/movie.service.interface"

/**
 * Servicio de Movie
 * -----------------
 * Contiene toda la lógica de negocio relacionada con la entidad Movie.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre el controlador y el repositorio.
 *  - Mantener al controlador libre de lógica de negocio.
 */

class MovieService implements IMovieService {

    async create(dto: CreateMovieDto): Promise<Movie> {

        // Verificar si ya existe una película con el mismo título
        const existingMovie = await repository.findByTitle(dto.title);

        if (existingMovie) {
            throw new AppError(400, "La película ya se encuentra registrada.");
        }

        // Crear la película
        return await repository.create(dto as Movie);
    }

    async findAll(): Promise<Movie[]> {
        return await repository.findAll();
    }
}

export default new MovieService();