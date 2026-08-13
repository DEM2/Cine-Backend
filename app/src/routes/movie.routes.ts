

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
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createMovie, getMovies, getMovieById, getMovieFunctions, getRecommendedMovies } from "../controllers/movie.controller";

const router = Router();


/**
 * POST /api/movies
 * ----------------
 * Crea una nueva película en la base de datos.
 *
 * Request Body: objeto con los atributos de `CreateMovieDto`.
 *
 * Response:
 *  - 201 Created: Retorna la película creada en formato JSON.
 *  - 400 Bad Request: Datos inválidos o película ya registrada.
 *  - 500 Internal Server Error: Error inesperado durante la creación.
 *
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
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
 *               - genre
 *               - rating
 *               - language
 *               - poster
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               original_title:
 *                 type: string
 *                 example: "Inception"
 *               synopsis:
 *                 type: string
 *                 example: "Dom Cobb es un ladrón especializado en infiltrarse en los sueños."
 *               director:
 *                 type: string
 *                 example: "Christopher Nolan"
 *               duration_minutes:
 *                 type: number
 *                 example: 148
 *               genre:
 *                 type: string
 *                 example: "Ciencia ficción"
 *               rating:
 *                 type: string
 *                 example: "PG-13"
 *               language:
 *                 type: string
 *                 example: "Inglés"
 *               dubbed:
 *                 type: boolean
 *                 example: true
 *               subtitled:
 *                 type: boolean
 *                 example: true
 *               poster:
 *                 type: string
 *                 example: "https://image.tmdb.org/t/p/original/poster.jpg"
 *               premiere:
 *                 type: boolean
 *                 example: false
 *               audience_rating:
 *                 type: number
 *                 example: 4.8
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               title: "Inception"
 *               director: "Christopher Nolan"
 *               duration_minutes: 148
 *       400:
 *         description: Invalid data or movie already registered
 *         content:
 *           application/json:
 *             example:
 *               error: "La película ya se encuentra registrada."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Could not create the movie"
 */
router.post("/", createMovie);

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
 *               genre: "Ciencia ficción"
 *               rating: "PG-13"
 *               language: "Inglés"
 *               dubbed: true
 *               subtitled: true
 *               poster: "https://image.tmdb.org/t/p/original/poster.jpg"
 *               premiere: false
 *               audience_rating: 4.8
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
 * Obtiene películas recomendadas (mismo género, excluyendo la película actual).
 *
 * Response:
 *  - 200 OK: Lista de películas recomendadas (objeto movie completo).
 *  - 404 Not Found: La película no existe.
 *  - 500 Internal Server Error: Error inesperado.
 *
 * @swagger
 * /api/movies/{id}/recommendations:
 *   get:
 *     summary: Obtener películas recomendadas para una película
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
 *                 genre: "Ciencia ficción"
 *                 rating: "PG-13"
 *                 language: "Inglés"
 *                 dubbed: true
 *                 subtitled: true
 *                 poster: "https://image.tmdb.org/t/p/original/interstellar.jpg"
 *                 premiere: false
 *                 audience_rating: 4.9
 *               - id: 3
 *                 title: "The Prestige"
 *                 original_title: "The Prestige"
 *                 synopsis: "Dos magos rivales se enfrentan en una competencia de ilusiones."
 *                 director: "Christopher Nolan"
 *                 duration_minutes: 130
 *                 genre: "Ciencia ficción"
 *                 rating: "PG-13"
 *                 language: "Inglés"
 *                 dubbed: false
 *                 subtitled: true
 *                 poster: "https://image.tmdb.org/t/p/original/prestige.jpg"
 *                 premiere: false
 *                 audience_rating: 4.7
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

export default router;


