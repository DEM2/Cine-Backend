// app/src/services/movie.service.ts

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import repository from "../repositories/movie.repository";
import AppError from "../error/appError";
import Movie from "../models/movie.model";
import Showtime from "../models/showtime.model";
import { IMovieService } from "../services/interfaces/movie.service.interface";

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

/**
 * Formatea una fecha como YYYY-MM-DD usando la zona horaria local.
 */
const formatISODate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

class MovieService implements IMovieService {
    findById(movieId: number) {
        throw new Error("Method not implemented.");
    }

    async create(dto: CreateMovieDto): Promise<Movie> {

        // Verificar si ya existe una película con el mismo título
        const existingMovie = await repository.findByTitle(dto.title);

        if (existingMovie) {
            throw new AppError(400, "La película ya se encuentra registrada.");
        }

        // Crear la película
        const movie = await repository.create(dto as Movie);

        // Crear showtimes si se proporcionaron en el DTO
        if (dto.showtimes && Array.isArray(dto.showtimes) && dto.showtimes.length > 0) {
            try {
                for (const showtimeData of dto.showtimes) {
                    await Showtime.create({
                        movieId: movie.id,
                        date: showtimeData.date,
                        time: showtimeData.time,
                        formatId: showtimeData.formatId,
                        complex: showtimeData.complex,
                        isActive: showtimeData.isActive ?? true,
                        isSoldOut: showtimeData.isSoldOut ?? false,
                    });
                }
            } catch (error: any) {
                // Si falla la creación de showtimes, eliminar la película creada
                await Movie.destroy({ where: { id: movie.id } });
                throw new AppError(400, `Error al crear los horarios: ${error.message}`);
            }
        }

        return movie;
    }

    async findAll(): Promise<Movie[]> {
        return await repository.findAll();
    }

    async getToday(): Promise<Movie[]> {
        return await repository.findToday(formatISODate(new Date()));
    }

    async getWeekly(): Promise<Movie[]> {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 7);

        return await repository.findWeekly(formatISODate(today), formatISODate(endDate));
    }

    async getFiltered(filters: MovieFilterDto): Promise<Movie[]> {
        return await repository.findFiltered(filters);
    }
}

export default new MovieService();