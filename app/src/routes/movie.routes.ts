

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
import { createMovie, getMovies } from "../controllers/movie.controller";

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


export default router;


