// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie, { MovieCreationAttributes } from "../../models/movie.model";

/**
 * Contrato del Repositorio de Películas
 * -------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IMovieRepository {

    /**
     * Crea una película y asocia sus géneros (N:M).
     */
    create(data: MovieCreationAttributes, genreIds: number[]): Promise<Movie>;

    /**
     * Obtiene todas las películas.
     */
    findAll(): Promise<Movie[]>;

    /**
     * Busca una película por su título.
     */
    findByTitle(title: string): Promise<Movie | null>;
}