import { Request, Response } from "express";

import cinemaComplexService from "../services/cinema.complex.service";
import AppError from "../error/appError";

/**
 * Obtiene el listado de complejos de cine activos.
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
 *   Lista de complejos de cine obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "cityId": 1,
 *     "name": "Multicine Viva",
 *     "address": "Carrera 51B #87-50",
 *     "isActive": true
 *   }
 * ]
 */
export const getCinemaComplexes = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const complexes = await cinemaComplexService.findAllActive();

        return res.status(200).json(complexes);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el listado de complejos de cine activos de una ciudad.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera el parámetro de ruta `cityId`:
 * @example
 * GET /api/complex/1
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
 *   Lista de complejos de cine obtenida correctamente.
 *
 * - **400 Bad Request**
 *   El `cityId` no es un número entero válido.
 *
 * - **404 Not Found**
 *   La ciudad no existe en la base de datos.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "cityId": 1,
 *     "name": "Multicine Viva",
 *     "address": "Carrera 51B #87-50",
 *     "isActive": true
 *   }
 * ]
 */
export const getCinemaComplexesByCity = async (req: Request, res: Response): Promise<Response> => {

    try {

        const cityId = Number(req.params.cityId);

        if (!Number.isInteger(cityId)) {
            return res.status(400).json({
                error: "El parámetro cityId debe ser un número entero"
            });
        }

        const complexes = await cinemaComplexService.findByCityId(cityId);

        return res.status(200).json(complexes);

    } catch (error: any) {

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};