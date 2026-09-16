import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import emailVerificationService from "../services/email-verification.service";

const authService = new AuthService();

export class AuthController {
  
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Capturamos IP y Dispositivo requeridos para la sección de Seguridad de la HU
      const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';
      const device = req.headers['user-agent'] || 'Unknown Device';

      // Ejecutamos el flujo llamando al servicio
      const result = await authService.login(email, password, ip, device);

      // Criterio de Aceptación: El usuario inicia sesión correctamente
      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error: any) {
      // Retornamos error 401 Unauthorized si algo falla en las validaciones
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

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
