import { Request, Response } from "express";
import AppError from "../error/appError";
import functionService from "../services/funtion.service";

export const getFunctionById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError(400, "El ID de la función es obligatorio");
        }

        const functionId = Number(id);
        if (!Number.isInteger(functionId) || functionId <= 0) {
            throw new AppError(400, "El ID de la función debe ser un número entero positivo");
        }

        const functionData = await functionService.findById(functionId);

        return res.status(200).json(functionData);
    } catch (error: unknown) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
