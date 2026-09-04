import { Request, Response } from "express";
import reservationService from "../services/seats-reservation.service";
import { LockSeatsDto } from "../dto/reservations/lock-seats.dto";
import { ReleaseSeatsDto } from "../dto/reservations/release-seats.dto";
import AppError from "../error/appError";

/**
 * POST /reservations/lock-seats
 * -----------------------------
 * Bloquea un conjunto de sillas de una función para un carrito.
 *
 * Request Body:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *  - seatIds: Sillas a bloquear.
 */
export const lockSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: LockSeatsDto = req.body;
    const result = await reservationService.lockSeats(dto);
    return res.status(201).json(result);
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
 * DELETE /reservations/release-seats
 * ----------------------------------
 * Libera un conjunto de sillas previamente bloqueadas por un carrito.
 *
 * Request Body:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 *  - seatIds: Sillas a liberar.
 */
export const releaseSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: ReleaseSeatsDto = req.body;
    const deleted = await reservationService.releaseSeats(dto);
    return res.status(200).json({ released: deleted });
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
 * GET /reservations/summary
 * -------------------------
 * Obtiene el resumen de las sillas bloqueadas por un carrito para una función.
 *
 * Query Params:
 *  - cartId: Identificador del carrito.
 *  - showtimeId: Identificador de la función.
 */
export const getReservationSummary = async (req: Request, res: Response): Promise<Response> => {
  try {
    const cartId = Number(req.query.cartId);
    const showtimeId = Number(req.query.showtimeId);
    const result = await reservationService.getReservationSummary(cartId, showtimeId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({
      error: error.message,
    });
  }
};