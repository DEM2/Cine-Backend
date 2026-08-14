import crypto from "crypto";
import AppError from "../error/appError";
import emailVerificationRepository from "../repositories/email-verification.repository";
import User from "../models/user.model";

class EmailVerificationService {

    async createVerificationToken(userId: number) {

        // Genera un token aleatorio de 32 bytes.
        // Un byte es una pequeña unidad de datos que podemos utilizar para generar información aleatoria.
        // luego los comvierte a texto hexadecimal para obtener el token de verificacion
        const token = crypto.randomBytes(32).toString("hex");

        // Convertimos el token en SHA-256 para guardarlo en la BD.
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

        // Devolvemos el token original para poder enviarlo por correo.
        return token;
    }

    /**
     * Verifica el correo electrónico de un usuario.
     */
    // recibe el token en forma se texto
    async verify(token: string) {

        // Convertimos el token recibido en su hash.
        // crypto trabaja con operaciones criptograficas
        const tokenHash = crypto
            // se crea el hash utilizando el algoritmo (sha256)
            .createHash("sha256")
            // usa el token como informacion para generar el hash
            .update(token)
            // termina de calcular el hash y da el resultado como texto hexadecimal
            // caracteres como (0 1 2 3 4 5 6 7 8 9 a b c d e f)
            .digest("hex");

        // Buscamos el token en la base de datos.
        const verification =
            await emailVerificationRepository.findByTokenHash(tokenHash);

        // Si no existe, el token no es válido.
        if (!verification) {
            throw new AppError(
                400,
                "El código de verificación no es válido"
            );
        }

        // Verificamos si el token ya fue utilizado.
        // usedAt cuando el token no se ha utilizado es null y cuando se utilizo (usedAt = 2026-08-12 02:30:15)
        if (verification.usedAt) {
            throw new AppError(
                400,
                "El código de verificación ya fue utilizado"
            );
        }

        // Verificamos si el token ya expiró.
        // fecha y hora actual y la fecha que se guardo cuando se creo el token
        if (new Date() > verification.expiresAt) {
            throw new AppError(
                400,
                "El código de verificación ha expirado"
            );
        }

        // Buscamos al usuario relacionado con el token.
        const user = await User.findByPk(verification.userId);

        if (!user) {
            throw new AppError(
                404,
                "Usuario no encontrado"
            );
        }

        // Activamos la cuenta.
        user.status = "ACTIVO";

        await user.save();

        // Marcamos el token como utilizado.
        // ejecuta la funcion que marca la verificacion como utilizada
        // lo guarda en la variable para que no se vuelva a utilizar 
        await emailVerificationRepository.markAsUsed(verification);

        return {
            message: "Correo electrónico verificado correctamente"
        };
    }
}

export default new EmailVerificationService();