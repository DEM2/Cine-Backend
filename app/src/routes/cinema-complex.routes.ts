// app/src/routes/cinema-complex.routes.ts

/**
 * Rutas de Complejo de Cine
 * ---------------------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `CinemaComplex`.
 *
 * Endpoints disponibles:
 *  - `GET /cinema-complexes/` : Obtener todos los complejos de cine.
 *  - `POST /cinema-complexes/`: Crear un nuevo complejo de cine.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createCinemaComplex, getCinemaComplexes } from "../controllers/cinema-complex.controller";

const router = Router();

/**
 * GET /
 * ----
 * Obtiene la lista completa de complejos de cine registrados en la base de datos.
 *
 * Response:
 *  - 200 OK: Devuelve un array de complejos de cine en formato JSON.
 *  - 500 Internal Server Error: En caso de error en la consulta.
 *
 * @swagger
 * /api/cinema-complexes:
 *   get:
 *     summary: Obtener todos los complejos de cine
 *     tags: [CinemaComplexes]
 *     responses:
 *       200:
 *         description: Lista de complejos de cine obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 cityId: 1
 *                 name: "Cine Colombia"
 *                 address: "Calle 123 # 45-67"
 *                 isActive: true
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los complejos de cine"
 */
router.get("/", getCinemaComplexes);

/**
 * POST /
 * -----
 * Crea un nuevo complejo de cine en la base de datos.
 *
 * Request Body:
 *  - `cityId`: number (obligatorio, debe existir en `cities`)
 *  - `name`: string (obligatorio)
 *  - `address`: string (obligatorio)
 *  - `isActive`: boolean (opcional, por defecto `true`)
 *
 * Response:
 *  - 201 Created: Retorna el complejo de cine creado en formato JSON.
 *  - 400 Bad Request: Datos inválidos.
 *  - 404 Not Found: La ciudad no existe.
 *  - 500 Internal Server Error: En caso de error en la creación.
 *
 * @swagger
 * /api/cinema-complexes:
 *   post:
 *     summary: Crear un nuevo complejo de cine
 *     tags: [CinemaComplexes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cityId
 *               - name
 *               - address
 *             properties:
 *               cityId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Cine Colombia"
 *               address:
 *                 type: string
 *                 example: "Calle 123 # 45-67"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Complejo de cine creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               cityId: 1
 *               name: "Cine Colombia"
 *               address: "Calle 123 # 45-67"
 *               isActive: true
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "El campo cityId es obligatorio y debe ser un número entero"
 *       404:
 *         description: La ciudad no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Ciudad no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo crear el complejo de cine"
 */
router.post("/", createCinemaComplex);

export default router;
