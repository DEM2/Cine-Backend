import crypto from "crypto";
import AppError from "../error/appError";
import emailVerificationRepository from "../repositories/email-verification.repository";
import User from "../models/user.model";

class EmailVerificationService {

    async createVerificationToken(userId: number) {

        // Genera un token aleatorio de 32 bytes.
        // Luego lo convierte a texto hexadecimal.
        const token = crypto
            .randomBytes(32)
            .toString("hex");

        // Convertimos el token en SHA-256
        // para guardar solamente el hash en la BD.
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // El token tendrá una duración de 24 horas.
        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        // Guardamos solamente el hash en la base de datos.
        await emailVerificationRepository.create({
            userId,
            tokenHash,
            expiresAt
        });

        // Devolvemos el token original
        // para poder enviarlo por correo.
        return token;
    }

    /**
     * Verifica el correo electrónico de un usuario.
     */
    async verify(token: string) {

        // Convertimos el token recibido en SHA-256
        // para compararlo con el almacenado en la BD.
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Buscar el token en la base de datos.
        const verification =
            await emailVerificationRepository.findByTokenHash(
                tokenHash
            );

        // El token no existe.
        if (!verification) {
            throw new AppError(
                400,
                "El código de verificación no es válido"
            );
        }

        // Verificar si el token ya fue utilizado.
        if (verification.usedAt) {
            throw new AppError(
                400,
                "El código de verificación ya fue utilizado"
            );
        }

        // Verificar si el token expiró.
        if (new Date() > verification.expiresAt) {
            throw new AppError(
                400,
                "El código de verificación ha expirado"
            );
        }

        // Buscar usuario relacionado con el token.
        const user = await User.findByPk(
            verification.userId
        );

        if (!user) {
            throw new AppError(
                404,
                "Usuario no encontrado"
            );
        }

        // Marcar el correo como verificado.
        user.isVerified = true;

        // Activar la cuenta.
        user.status = "ACTIVO";

        await user.save();

        // Marcar el token como utilizado
        // para impedir que se vuelva a usar.
        await emailVerificationRepository.markAsUsed(
            verification
        );

        return {
            message:
                "Correo electrónico verificado correctamente"
        };
    }
}

export default new EmailVerificationService();