
import { Request, Response } from "express";

import movieService from "../services/movie.service";
import { CreateMovieDto } from "../dto/movie/create-movie.dto";
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
    return res.status(501).json({
        message: "Pendiente: implementar funciones de película",
    });
};

