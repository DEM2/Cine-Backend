// app/src/routes/user.routes.ts

/**
 * Rutas de Usuario
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `User`.
 * 
 * Endpoints disponibles:
 *  - `POST /users/` : Crear un nuevo usuario.
 *  - `GET /users/`  : Obtener todos los usuarios registrados.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller";

const router = Router();

/**
 * POST /
 * -----
 * Crea un nuevo usuario en la base de datos con su perfil completo.
 * 
 * Request Body:
 *  - `email`: string (obligatorio, único)
 *  - `password`: string (obligatorio)
 *  - `document_type_id`: integer (obligatorio)
 *  - `document_number`: string (obligatorio)
 *  - `first_name`: string (obligatorio)
 *  - `last_name`: string (obligatorio)
 *  - `birth_date`: string (obligatorio, formato YYYY-MM-DD)
 *  - `gender`: string (obligatorio)
 *  - `phone`: string (obligatorio)
 *  - `address`: string (obligatorio)
 *  - `city_id`: integer (obligatorio)
 * 
 * Response:
 *  - 201 Created: Retorna el usuario creado en formato JSON.
 *  - 400 Bad Request: Si faltan datos obligatorios o el correo ya existe.
 *  - 500 Internal Server Error: En caso de error en la creación.
 * 
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - document_type_id
 *               - document_number
 *               - first_name
 *               - last_name
 *               - birth_date
 *               - gender
 *               - phone
 *               - address
 *               - city_id
 *             properties:
 *               email:
 *                 type: string
 *                 example: "daniel@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
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
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example: 
 *               id: 3
 *               email: "daniel@gmail.com"
 *               password: "123456"
 *               document_type_id: 1
 *               document_number: "1045678901"
 *               first_name: "Daniel"
 *               last_name: "Mendoza"
 *               birth_date: "2002-05-15"
 *               gender: "Masculino"
 *               phone: "3001234567"
 *               address: "Calle 123"
 *               city_id: 1
 *       400:
 *         description: Datos inválidos o correo duplicado
 *         content:
 *           application/json:
 *             example: 
 *               error: "El correo ya existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example: 
 *               error: "No se pudo crear el usuario"
 */
router.post("/", createUser);


/**
 * GET /
 * ----
 * Obtiene la lista completa de usuarios registrados en la base de datos.
 * 
 * Response:
 *  - 200 OK: Devuelve un array de usuarios en formato JSON.
 * 
 * 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             example: 
 *               - id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *               - id: 2
 *                 name: "Jane Doe"
 *                 email: "john.doe@example.com"
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example: 
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example: 
 *               error: "Error al obtener los usuarios"
 */
router.get("/", getUsers);

export default router;


