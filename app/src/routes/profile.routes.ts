/**
 * Rutas de Perfil
 * ---------------
 * Este archivo define las rutas HTTP para la gestión del perfil.
 * Permite a un usuario autenticado consultar y actualizar su información.
 */

import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
// import { verifyToken } from "../middlewares/auth.middleware"; 

const router = Router();

/**
 * GET /
 * ----
 * Obtiene el perfil completo del usuario autenticado, incluyendo 
 * sus preferencias de notificación, membresía y compras recientes.
 * 
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             example: 
 *               id: 1
 *               email: "juan@example.com"
 *               firstName: "Juan"
 *               lastName: "Pérez"
 *               phone: "3001234567"
 *               address: "Calle Falsa 123"
 *               photoUrl: "https://ejemplo.com/foto.jpg"
 *               notificationPreference:
 *                 transactionalEmail: true
 *                 promotionalEmail: true
 *                 sms: false
 *                 push: false
 *               membership:
 *                 membershipNumber: "MEM-16912345678"
 *                 currentPoints: 120
 *                 level: 
 *                   name: "ORO"
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", /* verifyToken, */ getProfile);

/**
 * PUT /
 * ----
 * Actualiza la información personal y las preferencias de notificación del usuario.
 * Si el usuario actualiza su correo, se requiere una nueva verificación (RN-034).
 * 
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               photo_url:
 *                 type: string
 *               email:
 *                 type: string
 *               notification_preferences:
 *                 type: object
 *                 properties:
 *                   transactionalEmail:
 *                     type: boolean
 *                   promotionalEmail:
 *                     type: boolean
 *                   sms:
 *                     type: boolean
 *                   push:
 *                     type: boolean
 *           example:
 *             first_name: "Juan Carlos"
 *             phone: "3119876543"
 *             email: "juan.nuevo@example.com"
 *             notification_preferences:
 *               transactionalEmail: true
 *               promotionalEmail: false
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             example: 
 *               message: "Perfil actualizado correctamente"
 *               emailVerificationRequired: true
 *       400:
 *         description: El correo ya está en uso u otros errores de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/", /* verifyToken, */ updateProfile);

export default router;