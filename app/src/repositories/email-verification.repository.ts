import EmailVerification from "../models/email-verification.model";

class EmailVerificationRepository {

    /**
     * Crea un nuevo registro de verificación de correo.
     */
    // guarda el tocken asociado al usuario
    async create(data: {
        userId: number;
        tokenHash: string;
        expiresAt: Date;
    }): Promise<EmailVerification> {

        return await EmailVerification.create(data);
    }

    /**
     * Busca una verificación por el hash del token.
     */
    // cuando el usuario hace clic al enlace, verfica si el tocken existe
    async findByTokenHash(
        tokenHash: string
    ): Promise<EmailVerification | null> {

        // busca en la tabla email un registro cuyo token sea igual al token 
        // que esta buscando y lo devuelve 
        return await EmailVerification.findOne({
            where: {
                tokenHash
            }
        });
    }

    /**
     * Marca el token como utilizado.
     */

    async markAsUsed(
        // recibe el registro de verificacion que se tenia anteriormente
        verification: EmailVerification
    ): Promise<EmailVerification> {

        // guarda la fehca y hora actual
        verification.usedAt = new Date();

        // guarda el cambio en postgreSql
        await verification.save();

        // devuelve actualizado
        return verification;
    }
}

export default new EmailVerificationRepository();