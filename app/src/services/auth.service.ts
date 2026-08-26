import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import { Audit } from "../models/audit.model";
import Membership from "../models/membership.model";
import { Benefit } from "../models/benefit.model";

export class AuthService {

    // Configuración de seguridad
    private readonly MAX_FAILED_ATTEMPTS = 5;
    private readonly LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

    public async login(
        email: string,
        password: string,
        ip: string,
        device: string
    ) {

        // 1. Buscar usuario
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        // 2. Verificar que el correo haya sido confirmado
        if (!user.isVerified) {
            throw new Error(
                "Debes verificar tu correo electrónico antes de iniciar sesión"
            );
        }

        // 3. Verificar que la cuenta esté activa
        if (user.status !== "ACTIVO") {
            throw new Error(
                "La cuenta no se encuentra activa"
            );
        }

        // 4. Verificar si la cuenta continúa bloqueada
        if (
            user.lockoutUntil &&
            user.lockoutUntil.getTime() > Date.now()
        ) {
            throw new Error(
                "Cuenta bloqueada. Intenta de nuevo en 15 minutos."
            );
        }

        // 5. Si el tiempo de bloqueo ya terminó,
        // reiniciar los intentos fallidos
        if (
            user.lockoutUntil &&
            user.lockoutUntil.getTime() <= Date.now()
        ) {
            user.failedLoginAttempts = 0;
            user.lockoutUntil = null;

            await user.save();
        }

        // 6. Validar contraseña
        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        // 7. Contraseña incorrecta
        if (!isValid) {

            user.failedLoginAttempts += 1;

            // Bloquear después de 5 intentos
            if (
                user.failedLoginAttempts >=
                this.MAX_FAILED_ATTEMPTS
            ) {
                user.lockoutUntil = new Date(
                    Date.now() + this.LOCK_TIME_MS
                );
            }

            await user.save();

            // Registrar intento fallido
            await Audit.create({
                userId: user.id,
                event: "LOGIN_FAILED",
                ip,
                device
            });

            throw new Error("Credenciales inválidas");
        }

        // 8. Contraseña correcta
        // Reiniciar intentos fallidos y bloqueo
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;

        await user.save();

        // 9. Crear payload para los tokens
        const payload = {
            userId: user.id,
            roleId: user.roleId
        };

        // 10. Crear Access Token
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: "15m"
            }
        );

        // 11. Crear Refresh Token
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: "7d"
            }
        );

        // 12. Eliminar Refresh Tokens anteriores
        await RefreshToken.destroy({
            where: {
                userId: user.id
            }
        });

        // 13. Guardar nuevo Refresh Token
        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // 14. Registrar acceso exitoso
        await Audit.create({
            userId: user.id,
            event: "LOGIN_SUCCESS",
            ip,
            device
        });

        // 15. Buscar membresía del usuario
        const membership = await Membership.findOne({
            where: {
                userId: user.id
            }
        });

        // 16. Buscar beneficios activos
        const activeBenefits = await Benefit.findAll({
            where: {
                userId: user.id,
                status: "active"
            }
        });

        // 17. Retornar información del usuario
        return {
            accessToken,
            refreshToken,

            membershipInfo: membership,

            activeBenefits,

            profile: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            }
        };
    }
}