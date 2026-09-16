// app/src/services/movie.service.ts

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import repository from "../repositories/movie.repository";
import roomRepository from "../repositories/room.repository";
import { MovieFilterCriteria, ShowtimeSearchCriteria } from "../repositories/types/movie-query.types";
import notificationRepository from "../repositories/notification.repository";
import UpcomingMovieNotification from "../models/upcoming-movie-notification.model";
import AppError from "../error/appError";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import MovieCast from "../models/movie-cast.model";
import Genre from "../models/genre.model";
import { IMovieService } from "../services/interfaces/movie.service.interface"
import Showtime from "../models/showtime.model";
import City from "../models/geo_locations/city.model";
import Department from "../models/geo_locations/department.model";
import Country from "../models/geo_locations/country.model";

import { FunctionFilterDto } from "../dto/funtion/funtion-filter.dto";

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
        const criteria: MovieFilterCriteria = {
            movie: {
                title: filters.title,
                genre: filters.genre,
                rating: filters.rating,
                language: filters.language,
                premiere: filters.premiere,
            },
            showtime: {
                date: filters.date,
                formatId: filters.formatId,
                complex: filters.complex,
                isSoldOut: filters.available !== undefined ? !filters.available : undefined,
            },
        };

        return await repository.findFiltered(criteria);
    }

    async findById(id: number): Promise<Movie> {
        const movie = await repository.findById(id);

        if (!movie) {
            throw new AppError(404, "La película no encontrada.");
        }

        return movie;
    }

    async findFunctions(
        movieId: number,
        filters: FunctionFilterDto = {}
    ): Promise<Showtime[]> {
        await this.findById(movieId);

        if (filters.date) {
            const selectedDate = new Date(`${filters.date}T00:00:00-05:00`);
            if (Number.isNaN(selectedDate.getTime())) {
                throw new AppError(400, "La fecha enviada no es válida.");
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastAvailableDate = new Date(today);
            lastAvailableDate.setDate(lastAvailableDate.getDate() + 7);

            if (selectedDate < today || selectedDate > lastAvailableDate) {
                throw new AppError(400, "Solo puedes consultar funciones desde hoy hasta los próximos 7 días.");
            }
        }

        const criteria = await this.buildShowtimeSearchCriteria(movieId, filters);
        return await repository.findFunctionsByCriteria(criteria);
    }

    private async buildShowtimeSearchCriteria(
        movieId: number,
        filters: FunctionFilterDto
    ): Promise<ShowtimeSearchCriteria> {
        const now = new Date();

        const limitDate = new Date(now);
        limitDate.setDate(limitDate.getDate() + 8);
        limitDate.setHours(0, 0, 0, 0);

        const criteria: ShowtimeSearchCriteria = {
            movieId,
            isActive: true,
            onlyWithAvailableSeats: true,
            startTimeGt: now,
            startTimeLt: limitDate,
        };

        if (filters.date) {
            const startOfDay = new Date(`${filters.date}T00:00:00-05:00`);
            const nextDay = new Date(`${filters.date}T00:00:00-05:00`);
            nextDay.setDate(nextDay.getDate() + 1);

            criteria.startTimeGte = startOfDay;
            criteria.startTimeLt = nextDay;
        }

        if (filters.roomId !== undefined) {
            criteria.roomId = filters.roomId;
        }

        if (filters.formatId !== undefined) {
            criteria.formatId = filters.formatId;
        }

        if (filters.language !== undefined) {
            criteria.language = filters.language;
        }

        if (filters.isSubtitled !== undefined) {
            criteria.isSubtitled = filters.isSubtitled;
        }

        if (filters.complexId !== undefined) {
            criteria.roomIds = await roomRepository.findIdsByComplexId(filters.complexId);
        }

        return criteria;
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

    /**
     *
     * HU005 - PRÓXIMAMENTE (sección de notificaciones y ubicaciones)
     * 
     *
     * Los siguientes métodos implementan la lógica de negocio de la
     * Historia de Usuario 005: "Visualización de Próximos Estrenos".
     */

    /**
     * HU005 - Obtiene el listado de próximos estrenos.
     *
     * RN-017: solo se muestran películas con estado "UPCOMING".
     * Se ordenan por fecha de estreno ascendente (lo aplica el repositorio).
     */
    async getUpcoming(): Promise<Movie[]> {
        return await repository.findByStatus("UPCOMING");
    }

    /**
     * HU005 - Obtiene el detalle de un próximo estreno específico.
     *
     * RN-017: si la película no existe O su estado no es "UPCOMING"
     * (por ejemplo, ya está en cartelera), se responde 404.
     */
    async getUpcomingById(id: number): Promise<Movie> {
        const movie = await repository.findById(id);
        if (!movie || movie.status !== "UPCOMING") {
            throw new AppError(404, "La película no está próxima a estrenarse.");
        }
        return movie;
    }

    /**
     * HU005 - Registra la solicitud de notificación de un usuario para el
     * estreno de una película ("Botón: Notificarme cuando esté disponible").
     *
     * Reglas de negocio aplicadas:
     *  - RN-017: solo se permite solicitar notificación de películas con
     *    estado UPCOMING. Si ya está en cartelera o no existe → 404.
     *  - RN-019: un usuario NO puede registrar más de una solicitud para la
     *    misma película → 400 si ya existe. Además, la tabla tiene un índice
     *    único compuesto (user_id, movie_id) que lo garantiza a nivel BD,
     *    este chequeo previo es la primera línea de defensa.
     *
     * Flujo:
     *  1. Validar que la película exista y esté UPCOMING (RN-017).
     *  2. Verificar que no exista una solicitud previa del usuario (RN-019).
     *  3. Crear el registro en `upcoming_movie_notifications`.
     *
     * El envío real del correo (RN-020) ocurre cuando la película cambia a
     * estado ACTIVE; por eso el registro nace con notified = false (default).
     */
    async createNotification(userId: number, movieId: number): Promise<UpcomingMovieNotification> {

        // 1. RN-017: validar existencia y estado de la película.
        const movie = await repository.findById(movieId);

        if (!movie || movie.status !== "UPCOMING") {
            throw new AppError(404, "La película no está próxima a estrenarse.");
        }

        // 2. RN-019: rechazar solicitudes duplicadas del mismo usuario.
        const existing = await notificationRepository.findOne(userId, movieId);

        if (existing) {
            throw new AppError(400, "Ya solicitaste notificación para esta película.");
        }

        // 3. Registrar la solicitud. Queda pendiente (notified = false)
        // hasta que la película entre en cartelera y se le envíe el correo.
        return await notificationRepository.create({ userId, movieId });
    }

    /**
     * HU005 - Obtiene todas las solicitudes de notificación registradas
     * por un usuario (para mostrarle a cuáles estrenos se suscribió).
     *
     * Cada solicitud incluye los datos básicos de la película asociada
     * (los agrega el repositorio mediante el include con alias "movie").
     */
    async getMyNotifications(userId: number): Promise<UpcomingMovieNotification[]> {
        return await notificationRepository.findByUser(userId);
    }

    /**
     * HU005 - Obtiene UNA solicitud de notificación específica del usuario.
     *
     * La búsqueda filtra por id Y userId al mismo tiempo: así un usuario
     * solo puede consultar sus propias solicitudes, nunca las de otro.
     * Si no existe esa combinación → 404.
     */
    async getMyNotificationById(id: number, userId: number): Promise<UpcomingMovieNotification> {
        const notification = await notificationRepository.findByIdAndUser(id, userId);
        if (!notification) {
            throw new AppError(404, "Notificación no encontrada.");
        }
        return notification;
    }

    /**
     * HU005/RN-018 - Obtiene las películas disponibles en una ciudad.
     *
     * Contexto: el catálogo varía según la ubicación geográfica. La
     * distribución se modela en la tabla `movie_locations` con un campo
     * discriminador (`scope`):
     *   - scope = 'COUNTRY' → disponible en TODO el país (city_id null).
     *   - scope = 'CITY'    → disponible únicamente en esa ciudad.
     *
     * Problema: la fila 'COUNTRY' guarda el país, pero el cliente consulta
     * por ciudad. Hay que "subir" en la jerarquía geográfica para saber
     * a qué país pertenece la ciudad consultada:
     *
     *      City → Department → Country
     *
     * Flujo:
     *  1. Buscar la ciudad e incluir su departamento y país (includes anidados).
     *  2. Validar que la ciudad exista → 404 si no.
     *  3. Extraer el countryId de la cadena city.department.country.
     *  4. Consultar películas cuya distribución cubra la ciudad:
     *       WHERE (scope='COUNTRY' AND country_id=<país>)
     *          OR (scope='CITY'    AND city_id=<ciudad>)
     *     (la condición exacta vive en el repositorio).
     */
    async getAvailableInCity(cityId: number): Promise<Movie[]> {

        // 1. Traer la ciudad con su departamento y su país en una sola consulta.
        //    Los alias "department" y "country" están definidos en associations.ts.
        const city = await City.findByPk(cityId, {
            include: [{
                model: Department,
                as: "department",
                include: [{ model: Country, as: "country" }]
            }]
        }) as any;

        // 2. Validación de existencia de la ciudad.
        if (!city) {
            throw new AppError(404, "La ciudad indicada no existe.");
        }

        // 3. Subir por la jerarquía geográfica para obtener el país.
        //    (optional chaining: si algún nivel viniera vacío, countryId queda undefined)
        const countryId = city.department?.country?.id;
        if (!countryId) {
            throw new AppError(404, "No se pudo determinar el país de la ciudad.");
        }

        // 4. Delegar la consulta de películas al repositorio con ambos datos.
        return await repository.findAvailableInCity(cityId, countryId);
    }
}

export default new MovieService();
