/**
 * Rutas de Reservas
 * ------------------
 * Define las rutas HTTP relacionadas con el bloqueo y liberación de sillas.
 *
 * Endpoints disponibles:
 *  - `POST /reservations/lock-seats` : Bloquear sillas de una función.
 *  - `DELETE /reservations/release-seats` : Liberar sillas bloqueadas.
 *
 */

import { Router } from "express";
import { lockSeats, releaseSeats } from "../controllers/seats-reservation.controller";

const router = Router();

/**
 * POST /reservations/lock-seats
 * -----------------------------
 * Bloquea un conjunto de sillas de una función para un carrito.
 *
 * Comportamiento idempotente por carrito: si alguna silla ya está bloqueada por
 * el MISMO `cartId`, se ignora (no falla). Solo se devuelve 409 si una silla
 * está bloqueada por OTRO carrito.
 *
 * Request Body:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *  - seatIds: Sillas a bloquear.
 *
 * Response:
 *  - 201 Created: Sillas bloqueadas correctamente (estado completo del carrito + total).
 *  - 400 Bad Request: Datos inválidos.
 *  - 404 Not Found: La función no existe.
 *  - 409 Conflict: Una o más sillas ya están bloqueadas por otro carrito.
 *
 * @swagger
 * /api/reservations/lock-seats:
 *   post:
 *     summary: Bloquear sillas de una función
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - showtimeId
 *               - seatIds
 *             properties:
 *               cartId:
 *                 type: integer
 *                 example: 1
 *               showtimeId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Sillas bloqueadas correctamente
 *         content:
 *           application/json:
 *             example:
 *               seats:
 *                 - id: 1
 *                   cartId: 1
 *                   showtimeId: 1
 *                   seatId: 1
 *                   price: "23000.00"
 *                   lockedAt: "2026-08-20T15:30:00.000Z"
 *               total: 69000
 *       400:
 *         description: Datos inválidos o silla no válida para la función
 *         content:
 *           application/json:
 *             example:
 *               message: "La silla A-2 no pertenece a la sala de la función."
 *       404:
 *         description: La función no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Función no encontrada."
 *       409:
 *         description: Una o más sillas ya están bloqueadas
 *         content:
 *           application/json:
 *             example:
 *               message: "Una o más sillas ya están bloqueadas."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al bloquear las sillas"
 */
router.post("/lock-seats", lockSeats);

/**
 * DELETE /reservations/release-seats
 * ----------------------------------
 * Libera un conjunto de sillas previamente bloqueadas por un carrito.
 *
 * Request Body:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *  - seatIds: Sillas a liberar.
 *
 * Response:
 *  - 200 OK: Sillas liberadas correctamente.
 *  - 400 Bad Request: Datos inválidos.
 *  - 404 Not Found: No hay sillas bloqueadas para liberar.
 *
 * @swagger
 * /api/reservations/release-seats:
 *   delete:
 *     summary: Liberar sillas bloqueadas de una función
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - showtimeId
 *               - seatIds
 *             properties:
 *               cartId:
 *                 type: integer
 *                 example: 1
 *               showtimeId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Sillas liberadas correctamente
 *         content:
 *           application/json:
 *             example:
 *               released: 3
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Debes indicar al menos una silla."
 *       404:
 *         description: No hay sillas bloqueadas para liberar
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontraron sillas bloqueadas para liberar."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al liberar las sillas"
 */
router.delete("/release-seats", releaseSeats);

export default router;