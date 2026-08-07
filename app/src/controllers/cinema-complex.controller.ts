import { Request, Response } from "express";

import cinemaComplexService from "../services/cinema-complex.service";
import AppError from "../error/appError";

/**
 * ============================================================================
 * Controlador de Complejos de Cine
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `CinemaComplex`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `CinemaComplexService`.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * CinemaComplexController
 *      │
 * CinemaComplexService
 *      │
 * CinemaComplexRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Obtiene el listado de complejos de cine.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
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
 *     "name": "Cine Colombia",
 *     "address": "Calle 123 # 45-67",
 *     "isActive": true
 *   }
 * ]
 */
export const getCinemaComplexes = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const cinemaComplexes = await cinemaComplexService.findAll();
    return res.status(200).json(cinemaComplexes);
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Crea un nuevo complejo de cine.
 *
 * Recibe la información enviada por el cliente, la valida y delega la operación
 * al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
 *   "cityId": 1,
 *   "name": "Cine Colombia",
 *   "address": "Calle 123 # 45-67",
 *   "isActive": true
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
 *   Complejo de cine creado correctamente.
 *
 * - **400 Bad Request**
 *   Datos inválidos en el body.
 *
 * - **404 Not Found**
 *   La ciudad indicada en `cityId` no existe.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 */
export const createCinemaComplex = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cityId, name, address, isActive } = req.body;

    // Validaciones de entrada.
    if (!cityId || !Number.isInteger(Number(cityId))) {
      return res.status(400).json({
        error: "El campo cityId es obligatorio y debe ser un número entero",
      });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        error: "El campo name es obligatorio y debe ser un texto",
      });
    }

    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return res.status(400).json({
        error: "El campo address es obligatorio y debe ser un texto",
      });
    }

    const cinemaComplex = await cinemaComplexService.create({
      cityId: Number(cityId),
      name,
      address,
      isActive,
    });

    return res.status(201).json(cinemaComplex);
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({
      error: error.message,
    });
  }
};
