

/**
 * Rutas de movie
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `movie`.
 *
 * Endpoints disponibles:
 *  - `POST /api/movies/` : Crear una nueva movie.
 *  - `GET /api/movies/`  : Obtener todas las movies.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createMovie, getMovies, getMoviesToday, getMoviesWeekly, getMoviesByFilters } from "../controllers/movie.controller";

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
 *               showtimes:
 *                 type: array
 *                 description: (Opcional) Horarios de función para la película
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - formatId
 *                     - complex
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2026-08-20"
 *                     time:
 *                       type: string
 *                       example: "14:30"
 *                     formatId:
 *                       type: number
 *                       example: 1
 *                     complex:
 *                       type: string
 *                       example: "Cinemark La Aurora"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isSoldOut:
 *                       type: boolean
 *                       example: false
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


export default router;


// aca esta la ruta para crear una pelicula, obtener todas las peliculas, obtener peliculas de hoy, obtener peliculas de la semana y obtener peliculas filtradas por query params.