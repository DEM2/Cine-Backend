// app/src/routes/city.routes.ts

/**
 * Rutas de Ciudad
 * ----------------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `City`.
 *
 * Endpoints disponibles:
 *  - `GET /cities/:departmentId` : Obtener todas las ciudades de un departamento.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { getCitiesByDepartment } from "../controllers/city.controller";

const router = Router();

/**
 * GET /:departmentId
 * ----------------
 * Obtiene la lista de ciudades pertenecientes al departamento indicado.
 *
 * Response:
 *  - 200 OK: Devuelve un array de ciudades en formato JSON.
 *  - 400 Bad Request: El `departmentId` no es un entero válido.
 *  - 404 Not Found: El departamento no existe.
 *
 * @swagger
 * /api/cities/{departmentId}:
 *   get:
 *     summary: Obtener todas las ciudades de un departamento
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         description: Identificador del departamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de ciudades obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Bogotá"
 *                 isActive: true
 *               - id: 2
 *                 name: "Medellín"
 *                 isActive: false
 *       400:
 *         description: El parámetro departmentId no es un número entero válido
 *         content:
 *           application/json:
 *             example:
 *               error: "El parámetro departmentId debe ser un número entero"
 *       404:
 *         description: El departamento no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Departamento no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener las ciudades"
 */
router.get("/:departmentId", getCitiesByDepartment);

export default router;