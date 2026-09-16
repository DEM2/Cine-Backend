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
import { lockSeats, releaseSeats, getReservationSummary } from "../controllers/seats-reservation.controller";

const router = Router();

/**
 * POST /reservations/lock-seats
 * -----------------------------
 * Bloquea un conjunto de sillas de una función para un carrito.
 *
 * Semántica del timer (RN-039): el tiempo de bloqueo (SEAT_LOCK_TTL_MINUTES,
 * default 10 min) inicia con el PRIMER bloqueo del carrito para esa función y
 * NO se extiende con bloqueos posteriores; los nuevos locks heredan la misma
 * fecha de expiración. Al expirar, todas las sillas del carrito se liberan
 * automáticamente (RN-040).
 *
 * Comportamiento idempotente por carrito: si alguna silla ya está bloqueada por
 * el MISMO `cartId`, se ignora (no falla). Solo se devuelve 409 si una silla
 * está bloqueada por OTRO carrito con un lock vigente.
 *
 * Límite de entradas: no se puede superar MAX_TICKETS_PER_SHOWTIME (default 5).
 *
 * Request Body:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *  - seatIds: Sillas a bloquear.
 *
 * Response:
 *  - 201 Created: Sillas bloqueadas correctamente (estado completo del carrito + total).
 *  - 400 Bad Request: Datos inválidos, silla no válida o máximo de entradas excedido.
 *  - 404 Not Found: La función no existe.
 *  - 409 Conflict: Una o más sillas están bloqueadas por otro carrito.
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
 *                   expiresAt: "2026-08-20T15:40:00.000Z"
 *               total: 69000
 *       400:
 *         description: Datos inválidos, silla no válida o máximo de entradas excedido
 *         content:
 *           application/json:
 *             examples:
 *               invalidSeat:
 *                 value:
 *                   message: "La silla A-2 no pertenece a la sala de la función."
 *               maxTickets:
 *                 value:
 *                   message: "No puedes seleccionar más de 5 entradas para esta función."
 *       404:
 *         description: La función no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Función no encontrada."
 *       409:
 *         description: Una o más sillas ya están bloqueadas por otro carrito
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

/**
 * GET /reservations/summary
 * -------------------------
 * Obtiene el resumen de las sillas bloqueadas por un carrito para una función.
 *
 * Query Params:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *
 * Response:
 *  - 200 OK: Resumen de la reserva con sillas, función y total.
 *  - 400 Bad Request: cartId y showtimeId son obligatorios.
 *  - 404 Not Found: No hay sillas bloqueadas para este carrito/función.
 *
 * @swagger
 * /api/reservations/summary:
 *   get:
 *     summary: Obtener resumen de reserva
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Resumen de la reserva
 *         content:
 *           application/json:
 *             example:
 *               cartId: 1
 *               showtime:
 *                 id: 1
 *                 movieId: 1
 *                 roomId: 1
 *                 startTime: "2026-08-20T18:00:00.000Z"
 *                 endTime: "2026-08-20T20:00:00.000Z"
 *                 basePrice: 23000
 *               seats:
 *                 - id: 1
 *                   code: "A-1"
 *                   rowLabel: "A"
 *                   seatNumber: 1
 *                   seatType: "Estándar"
 *                   price: 23000
 *               totalSeats: 1
 *               totalAmount: 23000
 *               expiresAt: "2026-08-20T15:40:00.000Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "cartId y showtimeId son obligatorios."
 *       404:
 *         description: No hay sillas bloqueadas
 *         content:
 *           application/json:
 *             example:
 *               message: "No hay sillas bloqueadas para este carrito y función."
 *       500:
 *         description: Error interno del servidor
 */
router.get("/summary", getReservationSummary);

export default router;