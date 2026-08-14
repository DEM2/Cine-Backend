import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model'; 
import { Audit } from '../models/audit.model';
import { Membership } from '../models/membership.model';
import { Benefit } from '../models/benefit.model';

export class AuthService {
  // Configuración de la RN-027
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

  public async login(email: string, passwordString: string, ip: string, device: string) {
    
    // PASO 1: Validar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Credenciales inválidas');

    // PASO 2 (RN-031): Validar si el correo está verificado
    if (!user.isVerified) {
      throw new Error('Debes verificar tu correo para iniciar sesión');
    }

    // PASO 3 (RN-027): Validar si la cuenta está bloqueada actualmente
    if (user.lockout_until && user.lockout_until.getTime() > Date.now()) {
      throw new Error('Cuenta bloqueada. Intenta de nuevo en 15 minutos.');
    }

    // PASO 4: Validar la contraseña
    const isValid = await user.validPassword(passwordString);
    if (!isValid) {
      // Registrar intento fallido (RN-027)
      await user.increment('failed_login_attempts');
      await user.reload(); // Recargar para obtener el nuevo valor

      // Bloquear cuenta si alcanzó el máximo
      if (user.failed_login_attempts >= this.MAX_FAILED_ATTEMPTS) {
        await user.update({ lockout_until: new Date(Date.now() + this.LOCK_TIME_MS) });
      }

      // Seguridad: Auditoría de acceso fallido
      await Audit.create({ userId: user.id, event: 'LOGIN_FAILED', ip, device });
      
      throw new Error('Credenciales inválidas');
    }

    // PASO 5: Contraseña correcta, limpiar intentos fallidos
    await user.update({ failed_login_attempts: 0, lockout_until: null });

    // PASO 6: Generar JWT (Access y Refresh)
    const payload = { userId: user.id, roleId: user.roleId };
    
    // RN-028: Access Token dura 15 minutos
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    
    // RN-029: Refresh Token dura 7 días
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    // PASO 7 (RN-030): Invalidar Refresh Tokens anteriores y guardar el nuevo
    await RefreshToken.destroy({ where: { userId: user.id } }); // Elimina los anteriores
    await RefreshToken.create({ 
      userId: user.id, 
      token: refreshToken, 
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

    // Seguridad: Auditoría de acceso exitoso
    await Audit.create({ userId: user.id, event: 'LOGIN_SUCCESS', ip, device });

    // PASO 8: Consultar membresía y beneficios
    const membership = await Membership.findOne({ where: { userId: user.id } });
    const activeBenefits = await Benefit.findAll({ where: { userId: user.id, status: 'active' } });

    // PASO 9: Retornar el objeto exacto que pide la HU
    return {
      accessToken,
      refreshToken,
      membershipInfo: membership,
      activeBenefits,
      profile: {
        name: `${user.firstName} ${user.lastName}`,// Concatenamos porque 'name' no existe en la DB
        email: user.email
      }
    };
  }
}