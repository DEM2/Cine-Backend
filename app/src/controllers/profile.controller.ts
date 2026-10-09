import { Request, Response } from "express";
import profileService from "../services/profile.service";
import AppError from "../error/appError";

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Asumiendo que tu middleware de JWT inyecta el id en req.user o req.body
        const userId = (req as any).user.id; 

        const profile = await profileService.getProfile(userId);
        return res.status(200).json(profile);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as any).user.id;
        const dto = req.body;

        const result = await profileService.updateProfile(userId, dto);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};