import { Request, Response } from "express";
import membershipService from "../services/membership.service";
import AppError from "../error/appError";

export const getMembership = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as any).user.id; 
        const membership = await membershipService.getMembershipDetails(userId);
        
        return res.status(200).json(membership);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const getBenefits = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as any).user.id; 
        const benefits = await membershipService.getBenefits(userId);
        
        return res.status(200).json(benefits);
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};