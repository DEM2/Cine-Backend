// app/src/services/movie.service.ts

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import repository from "../repositories/movie.repository";
import AppError from "../error/appError";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import MovieCast from "../models/movie-cast.model";
import Genre from "../models/genre.model";
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

/**
 * Formatea una fecha como YYYY-MM-DD usando la zona horaria local.
 */
const formatISODate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// class MovieService implements IMovieService {
//     findById(movieId: number) {
//         throw new Error("Method not implemented.");
//     }
class MovieService implements IMovieService {

    async create(dto: CreateMovieDto): Promise<Movie> {

        if (!dto.genres || dto.genres.length === 0) {
            throw new AppError(400, "Debes asignar al menos un género a la película.");
        }

        // Validar que los géneros existan
        const existingGenres = await Genre.findAll({
            where: { id: dto.genres },
        });
        if (existingGenres.length !== dto.genres.length) {
            const foundIds = existingGenres.map(g => g.id);
            const missing = dto.genres.filter(id => !foundIds.includes(id));
            throw new AppError(400, `Los siguientes géneros no existen: ${missing.join(", ")}`);
        }

        // Verificar si ya existe una película con el mismo título
        const existingMovie = await repository.findByTitle(dto.title);

        if (existingMovie) {
            throw new AppError(400, "La película ya se encuentra registrada.");
        }

        // Crear la película
        //const movie = await repository.create(dto as Movie);

        // Crear showtimes si se proporcionaron en el DTO
        // if (dto.showtimes && Array.isArray(dto.showtimes) && dto.showtimes.length > 0) {
        //     try {
        //         for (const showtimeData of dto.showtimes) {
        //             await Showtime.create({
        //                 movieId: movie.id,
        //                 date: showtimeData.date,
        //                 time: showtimeData.time,
        //                 formatId: showtimeData.formatId,
        //                 complex: showtimeData.complex,
        //                 isActive: showtimeData.isActive ?? true,
        //                 isSoldOut: showtimeData.isSoldOut ?? false,
        //             });
        //         }
        //     } catch (error: any) {
        //         // Si falla la creación de showtimes, eliminar la película creada
        //         await Movie.destroy({ where: { id: movie.id } });
        //         throw new AppError(400, `Error al crear los horarios: ${error.message}`);
        //     }
        // }


        const { genres, cast, ...movieData } = dto;

        const payload: MovieCreationAttributes = {
            ...movieData,
            release_date: new Date(movieData.release_date),
            is_release: movieData.is_release ?? false,
            status: movieData.status ?? "ACTIVE",
        };

        const movie = await repository.create(payload, genres);

        // Crear el reparto (actores) si se proporcionó en el DTO
        if (cast && Array.isArray(cast) && cast.length > 0) {
            await MovieCast.bulkCreate(
                cast.map((member) => ({
                    movieId: movie.id,
                    actorName: member.actorName,
                    roleName: member.roleName ?? null,
                }))
            );
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
        const movie = await this.findById(id);

        const genres = (movie as any).genres as { id: number }[] | undefined;
        const genreIds = genres?.map(genre => genre.id) ?? [];

        if (genreIds.length === 0) {
            throw new AppError(400, "La película no tiene géneros asignados.");
        }
        return await repository.findRecommendedMovies(movie.id, genreIds);
    }

    async getUpcoming(): Promise<Movie[]> {
        return await repository.findUpcoming();
    }

    async getUpcomingById(id: number): Promise<Movie> {
        const movie = await repository.findById(id);
        if (!movie || movie.status !== "UPCOMING") {
            throw new AppError(404, "La película no está próxima a estrenarse.");
        }
        return movie;
    }
}




export default new MovieService();