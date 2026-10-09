import { Request, Response } from "express";
import reservationService from "../services/seats-reservation.service";
import AppError from "../error/appError";

/**
 * GET /functions/:id/seats
 * ------------------------
 * Obtiene el mapa de sillas habilitadas de una función con su estado
 * (disponible o bloqueada) y su precio calculado.
 */
export const getShowtimeSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const showtimeId = Number(req.params.id);

    if (!Number.isInteger(showtimeId)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número entero",
      });
    }

    const seats = await reservationService.getShowtimeSeats(showtimeId);
    return res.status(200).json(seats);
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({
      error: error.message,
    });
  }
};