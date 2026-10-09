// app/src/routes/country.routes.ts

/**
 * Rutas de País
 * -------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Country`.
 *
 * Endpoints disponibles:
 *  - `GET /countries/`  : Obtener todos los países registrados.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { getCountries } from "../controllers/country.controller";

const router = Router();

/**
 * GET /
 * ----
 * Obtiene la lista completa de países registrados en la base de datos.
 *
 * Response:
 *  - 200 OK: Devuelve un array de países en formato JSON.
 *
 *
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Obtener todos los países
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Lista de países obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Colombia"
 *               - id: 2
 *                 name: "Estados Unidos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los países"
 */
router.get("/", getCountries);

export default router;
