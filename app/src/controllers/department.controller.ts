import { Request, Response } from "express";

import departmentService from "../services/department.service";
import AppError from "../error/appError";

/**
 * ============================================================================
 * Controlador de Departamentos
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `Department`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `DepartmentService`.
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
 * DepartmentController
 *      │
 * DepartmentService
 *      │
 * DepartmentRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Obtiene el listado de departamentos de un país.
 *
 * Recibe el `countryId` desde la ruta, lo valida y delega la consulta
 * a la capa de servicios.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera el parámetro de ruta `countryId`:
 * @example
 * GET /api/departments/1
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
 *   Lista de departamentos obtenida correctamente.
 *
 * - **400 Bad Request**
 *   El `countryId` no es un número entero válido.
 *
 * - **404 Not Found**
 *   El país no existe en la base de datos.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "Atlantico"
 *   }
 * ]
 */
export const getDepartmentsByCountry = async (req: Request, res: Response): Promise<Response> => {

    try {

        // Parsea el parámetro de ruta como número entero.
        const countryId = Number(req.params.countryId);

        // Valida que sea un entero válido.
        if (!Number.isInteger(countryId)) {
            return res.status(400).json({
                error: "El parámetro countryId debe ser un número entero"
            });
        }

        // Solicita la información al servicio.
        const departments = await departmentService.findByCountryId(countryId);

        // Retorna la colección de departamentos.
        return res.status(200).json(departments);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};
