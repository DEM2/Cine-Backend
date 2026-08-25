/**
 * Rutas de Función (Showtime)
 * --------------------------------------
 *
 * Endpoints disponibles:
 *  - `GET /functions/:id/seats` : Obtener el mapa de sillas de una función.
 */

import { Router } from "express";
import { getShowtimeSeats } from "../controllers/function.controller";

const router = Router();

/**
 * GET /functions/:id/seats
 * ------------------------
 * Obtiene el mapa de sillas habilitadas de una función con su estado
 * (disponible o bloqueada) y su precio calculado.
 *
 * Response:
 *  - 200 OK: Lista de sillas de la función.
 *  - 404 Not Found: La función no existe.
 *
 * @swagger
 * /api/functions/{id}/seats:
 *   get:
 *     summary: Obtener el mapa de sillas de una función
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la función
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de sillas obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 code: "A-1"
 *                 rowLabel: "A"
 *                 seatNumber: 1
 *                 seatType:
 *                   id: 2
 *                   code: "PREFERENTIAL"
 *                   name: "Preferencial"
 *                 status: "available"
 *                 lockedByCartId: null
 *                 price: 23000
 *               - id: 2
 *                 code: "A-2"
 *                 rowLabel: "A"
 *                 seatNumber: 2
 *                 seatType:
 *                   id: 2
 *                   code: "PREFERENTIAL"
 *                   name: "Preferencial"
 *                 status: "locked"
 *                 lockedByCartId: 3
 *                 price: 23000
 *       404:
 *         description: La función no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Función no encontrada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener las sillas de la función"
 */
router.get("/:id/seats", getShowtimeSeats);

export default router;