
/**
 * Rutas de Complejo de Cine
 * --------------------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `CinemaComplex`.
 *
 * Endpoints disponibles:
 *  - `GET /complex/` : Obtener todos los complejos de cine activos.
 *  - `GET /complex/:cityId` : Obtener los complejos de cine activos de una ciudad.
 *
 */

import { Router } from "express";
import { getCinemaComplexes, getCinemaComplexesByCity } from "../controllers/cinema.complex.controller";

const router = Router();

/**
 * GET /
 * ----
 * Obtiene la lista completa de complejos de cine activos.
 *
 * Response:
 *  - 200 OK: Devuelve un array de complejos de cine en formato JSON.
 *
 * @swagger
 * /api/complex:
 *   get:
 *     summary: Obtener todos los complejos de cine activos
 *     tags: [CinemaComplexes]
 *     responses:
 *       200:
 *         description: Lista de complejos de cine obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 cityId: 1
 *                 name: "Multicine Viva"
 *                 address: "Carrera 51B #87-50"
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
 * GET /:cityId
 * ------------
 * Obtiene la lista de complejos de cine activos pertenecientes a la ciudad indicada.
 *
 * Response:
 *  - 200 OK: Devuelve un array de complejos de cine en formato JSON.
 *  - 400 Bad Request: El `cityId` no es un entero válido.
 *  - 404 Not Found: La ciudad no existe.
 *
 * @swagger
 * /api/complex/{cityId}:
 *   get:
 *     summary: Obtener los complejos de cine activos de una ciudad
 *     tags: [CinemaComplexes]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         description: Identificador de la ciudad
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de complejos de cine obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 cityId: 1
 *                 name: "Multicine Viva"
 *                 address: "Carrera 51B #87-50"
 *                 isActive: true
 *       400:
 *         description: El parámetro cityId no es un número entero válido
 *         content:
 *           application/json:
 *             example:
 *               error: "El parámetro cityId debe ser un número entero"
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
 *               error: "Error al obtener los complejos de cine"
 */
router.get("/:cityId", getCinemaComplexesByCity);

export default router;