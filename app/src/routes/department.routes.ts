// app/src/routes/department.routes.ts

/**
 * Rutas de Departamento
 * ----------------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Department`.
 *
 * Endpoints disponibles:
 *  - `GET /departments/:countryId` : Obtener todos los departamentos de un país.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { getDepartmentsByCountry } from "../controllers/department.controller";

const router = Router();

/**
 * GET /:countryId
 * ----------------
 * Obtiene la lista de departamentos pertenecientes al país indicado.
 *
 * Response:
 *  - 200 OK: Devuelve un array de departamentos en formato JSON.
 *  - 400 Bad Request: El `countryId` no es un entero válido.
 *  - 404 Not Found: El país no existe.
 *
 * @swagger
 * /api/departments/{countryId}:
 *   get:
 *     summary: Obtener todos los departamentos de un país
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         description: Identificador del país
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de departamentos obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Atlantico"
 *               - id: 2
 *                 name: "Antioquia"
 *       400:
 *         description: El parámetro countryId no es un número entero válido
 *         content:
 *           application/json:
 *             example:
 *               error: "El parámetro countryId debe ser un número entero"
 *       404:
 *         description: El país no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "País no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los departamentos"
 */
router.get("/:countryId", getDepartmentsByCountry);

export default router;
