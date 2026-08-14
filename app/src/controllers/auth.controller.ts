import { Request, Response } from "express";
import emailVerificationService from "../services/email-verification.service";

class AuthController {

    // funcion que recibe la peticion http
    async verifyEmail(req: Request, res: Response) {

        // Obtener el token enviado por el usuario.
        const { token } = req.body;

        // Verificar que se haya enviado el token.
        if (!token) {
            return res.status(400).json({
                message: "El token de verificación es obligatorio"
            });
        }

        // Verificar el token y activar la cuenta.
        const result =
            await emailVerificationService.verify(token);

        return res.status(200).json(result);
    }
}

export default new AuthController();