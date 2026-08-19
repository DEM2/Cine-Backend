import { Request, Response } from "express";

import userService from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import AppError from "../error/appError";

/**
 * ============================================================================
 * Controlador de Usuarios
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `User`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `UserService`.
 *
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 *
 * Este controlador NO debe:
 *  - Contener reglas de negocio.
 *  - Acceder directamente a la base de datos.
 *  - Ejecutar consultas mediante Sequelize.
 *  - Realizar validaciones complejas del dominio.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * UserController
 *      │
 * UserService
 *      │
 * UserRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea un nuevo usuario.
 *
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
 *   "name": "David Mtz",
 *   "email": "david@example.com"
 * }
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **201 Created**
 *   Usuario creado correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createUser = async (req: Request, res: Response): Promise<Response> => {

    try {

        // Construcción del DTO recibido desde el cliente.
        const dto: CreateUserDto = req.body;

        // Delega la lógica de negocio al servicio.
        const user = await userService.create(dto);

        // Retorna el recurso creado.
        return res.status(201).json(user);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el listado completo de usuarios.
 *
 * Delega la consulta a la capa de servicios, la cual será responsable de
 * aplicar cualquier regla de negocio antes de consultar el repositorio.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
 *
 * En este endpoint no se utiliza, por ello se antepone "_" al nombre de la
 * variable para indicar explícitamente que el parámetro es requerido por
 * Express pero no será utilizado.
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "David",
 *     "email": "david@example.com"
 *   }
 * ]
 */
export const getUsers = async (_req: Request, res: Response): Promise<Response> => {

    try {

        // Solicita la información al servicio.
        const users = await userService.findAll();

        // Retorna la colección de usuarios.
        return res.status(200).json(users);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Guarda la ubicación geográfica seleccionada por el visitante (HU-002).
 *
 * Recibe el `city_id` enviado por el cliente, lo valida y delega la
 * operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
 *   "city_id": 1
 * }
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Ubicación validada y confirmada correctamente.
 *
 * - **400 Bad Request**
 *   El `city_id` no es un entero válido, la ciudad está inactiva o
 *   no cuenta con complejos de cine activos (RN-006).
 *
 * - **404 Not Found**
 *   La ciudad no existe.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 */
export const setUserLocation = async (req: Request, res: Response): Promise<Response> => {

    try {

        const { city_id } = req.body;

        if (city_id === undefined || city_id === null) {
            return res.status(400).json({
                error: "El campo city_id es obligatorio"
            });
        }

        const cityId = Number(city_id);

        if (!Number.isInteger(cityId)) {
            return res.status(400).json({
                error: "El campo city_id debe ser un número entero"
            });
        }

        const result = await userService.setLocation({ city_id: cityId });

        return res.status(200).json(result);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};