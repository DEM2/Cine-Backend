import { Request, Response } from "express";

import cityService from "../services/city.service";
import AppError from "../error/appError";

/**
 * ============================================================================
 * Controlador de Ciudades
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `City`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `CityService`.
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
 * CityController
 *      │
 * CityService
 *      │
 * CityRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Obtiene el listado de ciudades de un departamento.
 *
 * Recibe el `departmentId` desde la ruta, lo valida y delega la consulta
 * a la capa de servicios.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera el parámetro de ruta `departmentId`:
 * @example
 * GET /api/cities/1
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
 *   Lista de ciudades obtenida correctamente.
 *
 * - **400 Bad Request**
 *   El `departmentId` no es un número entero válido.
 *
 * - **404 Not Found**
 *   El departamento no existe en la base de datos.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "Bogotá",
 *     "isActive": true
 *   }
 * ]
 */
export const getCitiesByDepartment = async (req: Request, res: Response): Promise<Response> => {

    try {

        const departmentId = Number(req.params.departmentId);

        if (!Number.isInteger(departmentId)) {
            return res.status(400).json({
                error: "El parámetro departmentId debe ser un número entero"
            });
        }

        const cities = await cityService.findByDepartmentId(departmentId);

        return res.status(200).json(cities);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};