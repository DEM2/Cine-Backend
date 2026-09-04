/**
 * Rutas de Membresía
 * ------------------
 * Este archivo define las rutas HTTP para la consulta de membresías.
 * Permite a un usuario autenticado visualizar su estado y beneficios.
 */

import { Router } from "express";
import { getMembership, getBenefits } from "../controllers/membership.controller";
import { verifyToken } from "../middlewares/auth.middleware"; 

const router = Router();

/**
 * GET /
 * ----
 * Obtiene los detalles de la membresía activa del usuario (Nivel, QR, Puntos).
 * 
 * @swagger
 * /api/membership:
 *   get:
 *     summary: Obtener la credencial de membresía del usuario
 *     tags: [Membership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresía obtenida exitosamente
 *         content:
 *           application/json:
 *             example: 
 *               id: 1
 *               userId: 1
 *               membershipNumber: "MEM-16912345678"
 *               currentPoints: 1500
 *               status: "ACTIVA"
 *               level:
 *                 name: "PLATINO"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: El usuario no posee una membresía activa
 *       500:
 *         description: Error interno del servidor
 */
router.get("/",  verifyToken,  getMembership);

/**
 * GET /benefits
 * ----
 * Obtiene los beneficios (descuentos vigentes y bonos) asociados al 
 * nivel de membresía actual del usuario (RN-032).
 * 
 * @swagger
 * /api/membership/benefits:
 *   get:
 *     summary: Consultar beneficios de la membresía
 *     tags: [Membership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Beneficios listados exitosamente
 *         content:
 *           application/json:
 *             example: 
 *               level: "ORO"
 *               discounts: 
 *                 - "15% en confitería"
 *                 - "Lunes y Martes 2x1"
 *                 - "Fila preferencial"
 *               availableBonuses: []
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/benefits",  verifyToken,  getBenefits);

export default router;