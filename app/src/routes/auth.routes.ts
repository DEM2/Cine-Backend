import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de forma segura
 *     description: Autentica a un usuario registrado y devuelve tokens de acceso junto con información de perfil y membresía.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@cine.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: PasswordSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna JWT, Refresh Token, perfil, membresía y beneficios.
 *       401:
 *         description: Credenciales inválidas, correo no verificado o cuenta bloqueada (RN-027, RN-031).
 */
// Endpoints definidos en la HU
router.post('/login', authController.login.bind(authController));
// router.post('/refresh', authController.refresh.bind(authController));
// router.post('/logout', authController.logout.bind(authController));
// router.post('/forgot-password', authController.forgotPassword.bind(authController));
// router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;