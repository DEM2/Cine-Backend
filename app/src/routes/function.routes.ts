/**
 * Rutas de Función (Showtime)
 * --------------------------------------
 *
 * Endpoints disponibles:
 *  - `GET /functions/:id/seats` : Obtener el mapa de sillas de una función.
 */

import { Router } from "express";
import { getShowtimeSeats } from "../controllers/function.controller";
import { getFunctionById, getFunctionPrice } from "../controllers/funtion.controller";

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

/**
 * GET /functions/:id/prices
 * -------------------------
 * Obtiene el precio de entrada de una función, incluyendo los recargos
 * configurados para su formato y su sala. El recargo por tipo de silla se
 * consulta después en el mapa de sillas.
 *
 * @swagger
 * /api/functions/{id}/prices:
 *   get:
 *     summary: Obtener el precio de una función
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Precio calculado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               functionId: 1
 *               currency: COP
 *               basePrice: 18000
 *               format: { id: 2, name: "3D", extraCharge: 3000 }
 *               room: { id: 2, name: "Sala 2", extraCharge: 2000 }
 *               totalExtraCharges: 5000
 *               finalPrice: 23000
 *       400:
 *         description: La función ya inició o el ID no es válido
 *       404:
 *         description: La función no existe o no está disponible
 */
router.get("/:id/prices", getFunctionPrice);

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
