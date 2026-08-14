import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';
import { Audit } from '../models/audit.model';
import Membership from '../models/membership.model';
import { Benefit } from '../models/benefit.model';

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
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar si la cuenta está bloqueada
        if (
            user.lockoutUntil &&
            user.lockoutUntil.getTime() > Date.now()
        ) {
            throw new Error(
                'Cuenta bloqueada. Intenta de nuevo en 15 minutos.'
            );
        }

        // 3. Validar contraseña
        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        // 4. Contraseña incorrecta
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
                event: 'LOGIN_FAILED',
                ip,
                device
            });

            throw new Error('Credenciales inválidas');
        }

        // 5. Contraseña correcta
        // Reiniciar los intentos fallidos
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;

        await user.save();

        // 6. Crear payload para los tokens
        const payload = {
            userId: user.id,
            roleId: user.roleId
        };

        // 7. Crear Access Token
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: '15m'
            }
        );

        // 8. Crear Refresh Token
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: '7d'
            }
        );

        // 9. Eliminar Refresh Tokens anteriores
        await RefreshToken.destroy({
            where: {
                userId: user.id
            }
        });

        // 10. Guardar nuevo Refresh Token
        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // 11. Registrar acceso exitoso
        await Audit.create({
            userId: user.id,
            event: 'LOGIN_SUCCESS',
            ip,
            device
        });

        // 12. Buscar membresía del usuario
        const membership = await Membership.findOne({
            where: {
                userId: user.id
            }
        });

        // 13. Buscar beneficios activos
        const activeBenefits = await Benefit.findAll({
            where: {
                userId: user.id,
                status: 'active'
            }
        });

        // 14. Retornar información del usuario
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