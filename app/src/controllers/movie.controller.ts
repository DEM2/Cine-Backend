
import { Request, Response } from "express";
import movieService from "../services/movie.service";

import { CreateMovieDto } from "../dto/movie/create-movie.dto";
import { MovieFilterDto } from "../dto/movie/movie-filter.dto";
import AppError from "../error/appError";



/**
 * ============================================================================
 * Controlador de movie
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `movie`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `movieService`.
 *
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 *
 * Este controlador NO debe:
 *  - Contener reglas de negocio.
 *  - Acceder directamente a la base de datos.
 *  - Ejecutar consultas mediante Sequelize.
 *  - Realizar validaciones complejas del dominio.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * MovieController
 *      │
 * MovieService
 *      │
 * MovieRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea una nueva movie
 *
 * Recibe la información enviada por el administardor, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
"titulo": "Inception",
"poster_oficial": "https://image.tmdb.org/t/p/original/poster.jpg",
"banner": "https://image.tmdb.org/t/p/original/banner.jpg",
"trailer_oficial_youtube": {
    "titulo": "Inception - Official Trailer",
    "url": "https://www.youtube.com/embed/YoHD9XEInc0"
},
"sinopsis_completa": "Dom Cobb es un ladrón especializado en infiltrarse en los sueños de las personas para extraer secretos del subconsciente. Su habilidad lo convierte en un valioso espía corporativo, pero también lo ha obligado a vivir como fugitivo. Cuando recibe la oportunidad de recuperar su antigua vida, deberá realizar una tarea aparentemente imposible: implantar una idea en la mente de un objetivo en lugar de robarla. Para lograrlo, reúne a un equipo de especialistas y se enfrenta a desafíos donde la línea entre la realidad y los sueños se vuelve cada vez más difusa.",
"director": "Christopher Nolan",
"actores_principales": [
    "Leonardo DiCaprio",
    "Joseph Gordon-Levitt",
    "Elliot Page",
    "Tom Hardy",
    "Ken Watanabe",
    "Marion Cotillard",
    "Cillian Murphy",
    "Michael Caine"
],
"generos": [
    "Ciencia ficción",
    "Acción",
    "Suspenso"
],
"duracion": {
    "minutos": 148,
    "formato": "2h 28m"
},
"clasificacion": "PG-13",
"fecha_estreno": "2010-07-16",
"idiomas_disponibles": {
    "audio": [
    "Inglés",
    "Español",
    "Francés",
    "Alemán"
    ],
    "subtitulos": [
    "Español",
    "Inglés",
    "Francés",
    "Portugués",
    "Italiano"
    ]
  }
}
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **201 Created**
 *   Movie creada correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createMovie = async (req: Request, res: Response): Promise<Response> => {

    try {

        // Construcción del DTO recibido desde el cliente.
        const dto: CreateMovieDto = req.body;

        // Delega la lógica de negocio al servicio.
        const movie = await movieService.create(dto);

        // Retorna el recurso creado.
        return res.status(201).json(movie);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el listado completo de movies.
 *
 * Delega la consulta a la capa de servicios, la cual será responsable de
 * aplicar cualquier regla de negocio antes de consultar el repositorio.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
 *
 * En este endpoint no se utiliza, por ello se antepone "_" al nombre de la
 * variable para indicar explícitamente que el parámetro es requerido por
 * Express pero no será utilizado.
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "David",
 *     "email": "david@example.com"
 *   }
 * ]
 */
export const getMovies = async (_req: Request, res: Response): Promise<Response> => {

    try {

        // Solicita la información al servicio.
        const movie = await movieService.findAll();

        // Retorna la colección de movies.
        return res.status(200).json(movie);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene las películas con funciones activas para la fecha de hoy.
 *
 * No recibe parámetros; la fecha de hoy se calcula dentro del servicio.
 *
 * @async
 * @param {Request} _req - Objeto de la petición HTTP (no utilizado).
 * @param {Response} res - Objeto utilizado para construir la respuesta HTTP.
 * @returns {Promise<Response>}
 */
export const getMoviesToday = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const movies = await movieService.getToday();

        return res.status(200).json(movies);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene las películas con funciones activas en los próximos 7 días.
 *
 * No recibe parámetros; el rango de fechas se calcula dentro del servicio.
 *
 * @async
 * @param {Request} _req - Objeto de la petición HTTP (no utilizado).
 * @param {Response} res - Objeto utilizado para construir la respuesta HTTP.
 * @returns {Promise<Response>}
 */
export const getMoviesWeekly = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const movies = await movieService.getWeekly();

        return res.status(200).json(movies);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene las películas aplicando los filtros recibidos como query params.
 *
 * Parámetros aceptados (todos opcionales):
 *  - `title`, `genre`, `rating`, `language`, `premiere` (filtros de película).
 *  - `date` (YYYY-MM-DD), `formatId`, `complex`, `available` (filtros de función).
 *
 * @example
 * GET /api/movies/filtres?genre=Acci%C3%B3n&language=Español&premiere=true
 * GET /api/movies/filtres?date=2026-08-15&formatId=2
 *
 * @async
 * @param {Request} req - Objeto de la petición HTTP (query params).
 * @param {Response} res - Objeto utilizado para construir la respuesta HTTP.
 * @returns {Promise<Response>}
 */
export const getMoviesByFilters = async (req: Request, res: Response): Promise<Response> => {

    try {

        const { title, date, genre, rating, language, complex, formatId, premiere, available } =
            req.query as Record<string, string>;

        const filters: MovieFilterDto = {
            title,
            date,
            genre,
            rating,
            language,
            complex,
            formatId: formatId ? Number(formatId) : undefined,
            premiere: premiere !== undefined ? premiere === "true" : undefined,
            available: available !== undefined ? available === "true" : undefined
        };

        const movies = await movieService.getFiltered(filters);

        return res.status(200).json(movies);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el detalle de una película por id.
 * Stub temporal: la lógica (repository/service) se implementa después.
 */
export const getMovieById = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(_req.params.id)
        const movie = await movieService.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                message: "Película no encontrada",
            });
        }
        return res.status(200).json(movie);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }
        return res.status(500).json({
            error: error.message
        });
    }
}

/**
 * Obtiene las funciones futuras de una película.
 * Stub temporal: la lógica se implementa después.
 */
export const getMovieFunctions = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(_req.params.id)
        const functions = await movieService.findFunctions(movieId);
        return res.status(200).json(functions);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }
        return res.status(500).json({
            error: error.message
        });
    }
};

export const getRecommendedMovies = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(_req.params.id)
        const recommendedMovies = await movieService.findRecommendedMovies(movieId);
        return res.status(200).json(recommendedMovies);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                error: error.message
            });
        }
        return res.status(500).json({
            error: error.message
        });
    }
};

export const getUpcomingMovies = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const movies = await movieService.getUpcoming();
        return res.status(200).json(movies);
    } catch (error: any) {
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};

export const getUpcomingMovieById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(req.params.id);
        const movie = await movieService.getUpcomingById(movieId);
        return res.status(200).json(movie);
    } catch (error: any) {
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};

/**
 * 
 * HU005 - PRÓXIMAMENTE (controladores de notificaciones)
 * 
 *
 * Endpoints de la Historia de Usuario 005: "Visualización de Próximos Estrenos".
 *
 * Flujo arquitectónico (igual que el resto del proyecto):
 *
 *   Cliente HTTP → MovieController (este archivo) → MovieService
 *                → NotificationRepository → Sequelize → PostgreSQL
 *
 * NOTA DE SEGURIDAD (importante para la sustentación):
 *   Mientras el equipo no tiene middleware de autenticación, el `userId`
 *   se recibe del cliente (body o query). Esto es TEMPORAL: en producción
 *   el userId SIEMPRE debe salir del token JWT decodificado por un
 *   middleware, nunca de datos enviados por el cliente.
 */

/**
 * POST /api/movies/notifications/upcoming
 *
 * HU005 - Registra la solicitud de notificación de un usuario para el
 * estreno de una película próxima ("Notificarme cuando esté disponible").
 *
 * Responsabilidad del controlador: validar formato de los datos de entrada
 * y construir la respuesta HTTP. Las reglas de negocio (RN-017 y RN-019)
 * viven en el servicio, NO aquí.
 *
 * @async
 * @param {Request} req - Body esperado: { userId: number, movieId: number }
 * @param {Response} res - Respuesta HTTP construida.
 *
 * Posibles respuestas:
 *  - 201 Created: solicitud registrada (queda pendiente hasta el estreno).
 *  - 400 Bad Request: faltan campos / no son enteros válidos, o el usuario
 *    ya había solicitado notificación para esa película (RN-019).
 *  - 404 Not Found: la película no existe o no está UPCOMING (RN-017).
 *  - 500 Internal Server Error: error inesperado.
 */
export const createUpcomingMovieNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        // TODO: reemplazar por req.user.id cuando exista el middleware de autenticación.
        // El userId NO debe venir del body en producción.
        const userId = Number(req.body.userId);
        const movieId = Number(req.body.movieId);

        // Validación básica de entrada: enteros positivos.
        // Number("abc") da NaN y Number(1.5) no es entero → ambos caen aquí.
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: "El campo userId es obligatorio y debe ser un entero válido." });
        }

        if (!Number.isInteger(movieId) || movieId <= 0) {
            return res.status(400).json({ error: "El campo movieId es obligatorio y debe ser un entero válido." });
        }

        // Delega las reglas de negocio al servicio (RN-017 y RN-019).
        const notification = await movieService.createNotification(userId, movieId);

        // 201 Created: el recurso (la solicitud) fue creado.
        return res.status(201).json({
            message: "Notificación registrada. Te avisaremos cuando la película entre en cartelera.",
            notification
        });

    } catch (error: any) {
        // Los AppError son errores de negocio con su código HTTP asignado;
        // cualquier otra cosa es un fallo inesperado → 500.
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/movies/notifications/upcoming?userId={id}
 *
 * HU005 - Lista todas las solicitudes de notificación registradas por un
 * usuario (a cuáles próximos estrenos se suscribió), incluyendo datos
 * básicos de cada película.
 *
 * @async
 * @param {Request} req - Query param requerido: userId (temporal hasta auth).
 * @param {Response} res
 *
 * Posibles respuestas:
 *  - 200 OK: arreglo de solicitudes (puede venir vacío si no hay ninguna).
 *  - 400 Bad Request: falta userId o no es un entero válido.
 *  - 500 Internal Server Error: error inesperado.
 */
export const getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
        // TODO: reemplazar por req.user.id cuando exista el middleware de autenticación.
        const userId = Number(req.query.userId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: "El query param userId es obligatorio y debe ser un entero válido." });
        }

        const notifications = await movieService.getMyNotifications(userId);

        return res.status(200).json(notifications);

    } catch (error: any) {
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/movies/notifications/upcoming/{id}?userId={id}
 *
 * HU005 - Consulta UNA solicitud de notificación específica.
 *
 * Detalle de seguridad: el servicio busca por id Y userId a la vez,
 * de modo que aunque el usuario conozca el id de una solicitud ajena,
 * la consulta no le devolverá nada (404).
 *
 * @async
 * @param {Request} req - Param de ruta: id de la solicitud. Query: userId.
 * @param {Response} res
 *
 * Posibles respuestas:
 *  - 200 OK: la solicitud solicitada con sus datos.
 *  - 400 Bad Request: falta userId o no es válido.
 *  - 404 Not Found: no existe una solicitud con ese id PARA ESE usuario.
 *  - 500 Internal Server Error: error inesperado.
 */
export const getNotificationById = async (req: Request, res: Response): Promise<Response> => {
    try {
        // TODO: reemplazar por req.user.id cuando exista el middleware de autenticación.
        const userId = Number(req.query.userId);
        const notificationId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: "El query param userId es obligatorio y debe ser un entero válido." });
        }

        const notification = await movieService.getMyNotificationById(notificationId, userId);

        return res.status(200).json(notification);

    } catch (error: any) {
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/movies/by-city?cityId={id}
 *
 * HU005/RN-018 - Lista las películas DISPONIBLES en una ciudad.
 *
 * Concepto clave: la disponibilidad se modela en la tabla `movie_locations`
 * con un discriminador (`scope`):
 *   - 'COUNTRY' → disponible en todo el país (una sola fila, city_id null).
 *   - 'CITY'    → disponible solo en ciudades específicas (una fila por ciudad).
 *
 * Como el cliente pregunta por ciudad pero las filas 'COUNTRY' guardan país,
 * el servicio primero "sube" por la jerarquía City → Department → Country
 * para obtener el país, y luego consulta:
 *     (scope='COUNTRY' AND country_id = <país de la ciudad>)
 *     OR (scope='CITY' AND city_id = <ciudad pedida>)
 *
 * @async
 * @param {Request} req - Query param requerido: cityId.
 * @param {Response} res
 *
 * Posibles respuestas:
 *  - 200 OK: películas disponibles (con genres y locations incluidas).
 *  - 400 Bad Request: falta cityId o no es un entero válido.
 *  - 404 Not Found: la ciudad no existe (o su país no pudo determinarse).
 *  - 500 Internal Server Error: error inesperado.
 */
export const getMoviesByCity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cityId = Number(req.query.cityId);

        if (!Number.isInteger(cityId) || cityId <= 0) {
            return res.status(400).json({ error: "El query param cityId es obligatorio y debe ser un entero válido." });
        }

        // El servicio resuelve ciudad → país y delega al repositorio.
        const movies = await movieService.getAvailableInCity(cityId);

        return res.status(200).json(movies);

    } catch (error: any) {
        if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
};