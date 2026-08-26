// app/src/routes/department.routes.ts

/**
 * Rutas de Funcion
 * ----------------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Function`.
 *
 * Endpoints disponibles:
 *  - `GET /functions/:id` : Obtener una función por su ID.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { getFunctionById } from "../controllers/funtion.controller";

const router = Router();

/**
 * @swagger
 * /api/functions/{id}:
 *   get:
 *     summary: Obtener una función por su ID
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador numérico de la función
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Función obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               movieId: 2
 *               roomId: 3
 *               formatId: 1
 *               language: "Español"
 *               isSubtitled: false
 *               startTime: "2026-08-25T19:00:00.000Z"
 *               endTime: "2026-08-25T21:00:00.000Z"
 *               basePrice: 18000
 *               availableSeats: 80
 *               isActive: true
 *       400:
 *         description: El ID enviado no es un número válido
 *         content:
 *           application/json:
 *             example:
 *               message: "El ID de la función debe ser un número entero positivo"
 *       404:
 *         description: La función no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "La funcion no ha sido encontrada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Error interno del servidor"
 */
router.get("/:id", getFunctionById);

export default router;
