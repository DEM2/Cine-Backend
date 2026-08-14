import { Router } from "express";
import { createUser, auth } from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const router = Router();

// Registro de usuario
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - email_confirmation
 *               - password
 *               - password_confirmation
 *               - document_type_id
 *               - document_number
 *               - first_name
 *               - last_name
 *               - birth_date
 *               - phone
 *               - address
 *               - city_id
 *               - data_processing_consent
 *               - terms_and_conditions
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "daniel@gmail.com"
 *               email_confirmation:
 *                 type: string
 *                 format: email
 *                 example: "daniel@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               password_confirmation:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               document_type_id:
 *                 type: integer
 *                 example: 1
 *               document_number:
 *                 type: string
 *                 example: "1045678901"
 *               first_name:
 *                 type: string
 *                 example: "Daniel"
 *               last_name:
 *                 type: string
 *                 example: "Mendoza"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "2002-05-15"
 *               gender:
 *                 type: string
 *                 example: "Masculino"
 *               phone:
 *                 type: string
 *                 example: "3001234567"
 *               address:
 *                 type: string
 *                 example: "Calle 123"
 *               city_id:
 *                 type: integer
 *                 example: 5
 *               favorite_complex_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               data_processing_consent:
 *                 type: boolean
 *                 example: true
 *               terms_and_conditions:
 *                 type: boolean
 *                 example: true
 *               commercial_communications:
 *                 type: boolean
 *                 example: false
 *               captchaToken: 
 *                 type: string
 *                 example: "XXXX.DUMMY.TOKEN.XXXX"
 *                 
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o correo duplicado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", createUser);

// Inicio de sesión
/**
 * POST /
 * -----
 * Autenticacion
 * 
 * Request Body:
 *  - `email`: string (obligatorio, único)
 *  - `password`: string (obligatorio)
 * 
 * Response:
 *  - 200 successfully: Retorna el usuario autenticado en formato JSON.
 *  - 500 Internal Server Error: En caso de error en la busqueda.
 * 
 * 
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar
 *     tags: [Auth]
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
 *                 example: "john.doe@example.com"
 *               password: 
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: usuario autenticado
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               password: "Password123!"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo hacer la busqueda"
 */
router.post("/login", auth);

// Verificación del correo
/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verificar el correo electrónico del usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "8f31a7c92b5e4d..."
 *     responses:
 *       200:
 *         description: Correo electrónico verificado correctamente
 *       400:
 *         description: Token inválido, expirado o ya utilizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/verify-email", authController.verifyEmail);

export default router;