

/**
 * Rutas de movie
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `movie`.
 *
 * Endpoints disponibles:
 *  - `POST /api/movies/` : Crear una nueva movie.
 *  - `GET /api/movies/`  : Obtener todas las movies.
 *  - `GET /api/movies/:id` : Obtener el detalle de una movie.
 *  - `GET /api/movies/:id/functions` : Obtener funciones futuras de una movie.
 *  - `GET /api/movies/:id/recommendations` : Obtener películas recomendadas por géneros.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createMovie, getMovies, getMoviesToday, getMoviesWeekly, getMoviesByFilters, getMovieById, getMovieFunctions, getRecommendedMovies } from "../controllers/movie.controller";


const router = Router();


/**
 * POST /api/movies
 * ----------------
 * Crea una nueva película en la base de datos.
 *
 * Request Body: objeto con los atributos de `CreateMovieDto`.
 * Nota: Los showtimes se crean separadamente en la tabla showtimes.
 *
 * Response:
 *  - 201 Created: Retorna la película creada en formato JSON con sus géneros.
 *  - 400 Bad Request: Datos inválidos, sin géneros, o película ya registrada.
 *  - 500 Internal Server Error: Error inesperado durante la creación.
 *
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crear una nueva película
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - original_title
 *               - synopsis
 *               - director
 *               - duration_minutes
 *               - genres
 *               - rating
 *               - language
 *               - poster
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la película
 *                 example: "Inception"
 *               original_title:
 *                 type: string
 *                 description: Título original
 *                 example: "Inception"
 *               synopsis:
 *                 type: string
 *                 description: Sinopsis completa
 *                 example: "Dom Cobb es un ladrón especializado en infiltrarse en los sueños."
 *               director:
 *                 type: string
 *                 description: Director de la película
 *                 example: "Christopher Nolan"
 *               duration_minutes:
 *                 type: integer
 *                 description: Duración en minutos
 *                 example: 148
 *               genres:
 *                 type: array
 *                 description: IDs de géneros existentes. Al menos uno es obligatorio.
 *                 minItems: 1
 *                 items:
 *                   type: integer
 *                 example: [1, 6]
 *               rating:
 *                 type: string
 *                 description: Clasificación de la película
 *                 example: "PG-13"
 *               language:
 *                 type: string
 *                 description: Idioma original
 *                 example: "Inglés"
 *               dubbed:
 *                 type: boolean
 *                 description: Disponible doblada
 *                 example: true
 *               subtitled:
 *                 type: boolean
 *                 description: Disponible subtitulada
 *                 example: true
 *               poster:
 *                 type: string
 *                 description: URL del póster oficial
 *                 example: "https://image.tmdb.org/t/p/original/poster.jpg"
 *               premiere:
 *                 type: boolean
 *                 description: Es un estreno
 *                 example: false
 *               audience_rating:
 *                 type: number
 *                 description: Calificación del público
 *                 example: 4.8
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Inception"
 *               original_title: "Inception"
 *               synopsis: "Dom Cobb es un ladrón especializado en infiltrarse en los sueños."
 *               director: "Christopher Nolan"
 *               duration_minutes: 148
 *               rating: "PG-13"
 *               language: "Inglés"
 *               dubbed: true
 *               subtitled: true
 *               poster: "https://image.tmdb.org/t/p/original/poster.jpg"
 *               premiere: false
 *               audience_rating: 4.8
 *               genres:
 *                 - id: 1
 *                   name: "Acción"
 *                 - id: 6
 *                   name: "Ciencia ficción"
 *       400:
 *         description: Datos inválidos, sin géneros, o película ya registrada
 *         content:
 *           application/json:
 *             examples:
 *               alreadyRegistered:
 *                 value:
 *                   error: "La película ya se encuentra registrada."
 *               missingGenres:
 *                 value:
 *                   error: "Debes asignar al menos un género a la película."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Could not create the movie"
 */
router.post("/", createMovie);

/**
 * GET /api/movies/today
 * ---------------------
 * Obtiene las películas con funciones activas para la fecha de hoy.
 *
 * Response:
 *  - 200 OK: Retorna un arreglo de películas (con sus showtimes) en formato JSON.
 *
 * @swagger
 * /api/movies/today:
 *   get:
 *     summary: Get movies with active showtimes today
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Today's movie list obtained successfully
 *       500:
 *         description: Internal server error
 */
router.get("/today", getMoviesToday);

/**
 * GET /api/movies/weekly
 * ----------------------
 * Obtiene las películas con funciones activas en los próximos 7 días.
 *
 * Response:
 *  - 200 OK: Retorna un arreglo de películas (con sus showtimes) en formato JSON.
 *
 * @swagger
 * /api/movies/weekly:
 *   get:
 *     summary: Get movies with active showtimes in the next 7 days
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Weekly movie list obtained successfully
 *       500:
 *         description: Internal server error
 */
router.get("/weekly", getMoviesWeekly);

/**
 * GET /api/movies/filtres
 * -----------------------
 * Obtiene las películas aplicando filtros combinados por query params.
 *
 * Parámetros (todos opcionales):
 *  - `title`, `genre`, `rating`, `language`, `premiere` (filtros de película).
 *  - `date` (YYYY-MM-DD), `formatId`, `complex`, `available` (filtros de función).
 *
 * @swagger
 * /api/movies/filtres:
 *   get:
 *     summary: Get movies applying combined filters
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *       - in: query
 *         name: rating
 *         schema: { type: string }
 *       - in: query
 *         name: language
 *         schema: { type: string }
 *       - in: query
 *         name: premiere
 *         schema: { type: boolean }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: formatId
 *         schema: { type: integer }
 *       - in: query
 *         name: complex
 *         schema: { type: string }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Filtered movie list obtained successfully
 *       500:
 *         description: Internal server error
 */
router.get("/filtres", getMoviesByFilters);

/**
 * GET /api/movies
 * ---------------
 * Obtiene la lista completa de películas registradas en la base de datos.
 * 
 * Response:
 *  - 200 OK: Retorna un arreglo de películas en formato JSON.
 * 
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Movie list obtained successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: "Inception"
 *                 director: "Christopher Nolan"
 *               - id: 2
 *                 title: "Interstellar"
 *                 director: "Christopher Nolan"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Error retrieving the movies"
 */
router.get("/", getMovies);

/**
 * GET /api/movies/{id}/functions
 * ------------------------------
 * Obtiene las funciones disponibles de una película
 *
 * Response:
 *  - 200 OK: Lista de funciones disponibles.
 *  - 404 Not Found: La película no existe.
 *  - 500 Internal Server Error: Error inesperado.
 *
 * @swagger
 * /api/movies/{id}/functions:
 *   get:
 *     summary: Obtener funciones disponibles de una película
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la película
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de funciones disponibles obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 movieId: 1
 *                 roomId: 1
 *                 formatId: 1
 *                 language: "Español"
 *                 isSubtitled: false
 *                 startTime: "2026-08-15T18:30:00.000Z"
 *                 endTime: "2026-08-15T21:00:00.000Z"
 *                 basePrice: 18000.00
 *                 availableSeats: 80
 *                 isActive: true
 *                 isSoldOut: false
 *               - id: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 movieId: 1
 *                 roomId: 1
 *                 formatId: 3
 *                 language: "Español"
 *                 isSubtitled: false
 *                 startTime: "2026-08-16T16:00:00.000Z"
 *                 endTime: "2026-08-16T18:30:00.000Z"
 *                 basePrice: 35000.00
 *                 availableSeats: 0
 *                 isActive: true
 *                 isSoldOut: true
 *       404:
 *         description: La película no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Película no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener las funciones de la película"
 */
router.get("/:id/functions", getMovieFunctions);

/**
 * GET /api/movies/{id}/recommendations
 * ------------------------------------
 * Obtiene películas recomendadas (comparten al menos un género, excluyendo la película actual).
 *
 * Response:
 *  - 200 OK: Lista de películas recomendadas (puede ser [] si no hay coincidencias).
 *  - 404 Not Found: La película no existe.
 *  - 500 Internal Server Error: Error inesperado.
 *
 * @swagger
 * /api/movies/{id}/recommendations:
 *   get:
 *     summary: Obtener películas recomendadas para una película
 *     description: Devuelve otras películas que comparten al menos un género con la película indicada.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la película
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de películas recomendadas obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 2
 *                 title: "Interstellar"
 *                 original_title: "Interstellar"
 *                 synopsis: "Un grupo de exploradores viaja a través de un agujero de gusano en el espacio."
 *                 director: "Christopher Nolan"
 *                 duration_minutes: 169
 *                 rating: "PG-13"
 *                 language: "Inglés"
 *                 dubbed: true
 *                 subtitled: true
 *                 poster: "https://image.tmdb.org/t/p/original/interstellar.jpg"
 *                 premiere: false
 *                 audience_rating: 4.9
 *                 genres:
 *                   - id: 6
 *                     name: "Ciencia ficción"
 *               - id: 3
 *                 title: "The Prestige"
 *                 original_title: "The Prestige"
 *                 synopsis: "Dos magos rivales se enfrentan en una competencia de ilusiones."
 *                 director: "Christopher Nolan"
 *                 duration_minutes: 130
 *                 rating: "PG-13"
 *                 language: "Inglés"
 *                 dubbed: false
 *                 subtitled: true
 *                 poster: "https://image.tmdb.org/t/p/original/prestige.jpg"
 *                 premiere: false
 *                 audience_rating: 4.7
 *                 genres:
 *                   - id: 4
 *                     name: "Drama"
 *                   - id: 6
 *                     name: "Ciencia ficción"
 *       404:
 *         description: La película no existe
 *         content:
 *           application/json:
 *             example:
 *               error: "La película no encontrada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener las películas recomendadas"
 */
router.get("/:id/recommendations", getRecommendedMovies);

/**
 * GET /api/movies/{id}
 * --------------------
 * Obtiene el detalle completo de una película por su identificador.
 *
 * Response:
 *  - 200 OK: Retorna el detalle de la película en formato JSON.
 *  - 404 Not Found: La película no existe.
 *  - 500 Internal Server Error: Error inesperado durante la consulta.
 *
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Obtener el detalle de una película
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la película
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalle de la película obtenido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Inception"
 *               original_title: "Inception"
 *               synopsis: "Dom Cobb es un ladrón especializado en infiltrarse en los sueños."
 *               director: "Christopher Nolan"
 *               duration_minutes: 148
 *               rating: "PG-13"
 *               language: "Inglés"
 *               dubbed: true
 *               subtitled: true
 *               poster: "https://image.tmdb.org/t/p/original/poster.jpg"
 *               premiere: false
 *               audience_rating: 4.8
 *               genres:
 *                 - id: 1
 *                   name: "Acción"
 *                 - id: 6
 *                   name: "Ciencia ficción"
 *       404:
 *         description: La película no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Película no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener el detalle de la película"
 */
router.get("/:id", getMovieById);

export default router;


// aca esta la ruta para crear una pelicula, obtener todas las peliculas, obtener peliculas de hoy, obtener peliculas de la semana y obtener peliculas filtradas por query params.