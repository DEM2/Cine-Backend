import userRepository from "../repositories/user.repository";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import AppError from "../error/appError";
import sequelize from "../config/database";
import UserNotificationPreference from "../models/user-notification-preference.model";
import emailVerificationService from "./email-verification.service";

class ProfileService {
    
    async getProfile(userId: number) {
        const profile = await userRepository.findProfileById(userId);
        
        if (!profile) {
            throw new AppError(404, "Perfil de usuario no encontrado");
        }
        
        return profile;
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError(404, "Usuario no encontrado");
        }

        const t = await sequelize.transaction();
        let emailVerificationRequired = false;

        try {
            const userUpdateData: any = {
                firstName: dto.first_name || user.firstName,
                lastName: dto.last_name || user.lastName,
                phone: dto.phone || user.phone,
                address: dto.address || user.address,
                photoUrl: dto.photo_url !== undefined ? dto.photo_url : user.photoUrl
            };

            // RN-034: Lógica de cambio de correo
            if (dto.email && dto.email !== user.email) {
                const emailExists = await userRepository.findByEmail(dto.email);
                if (emailExists) {
                    throw new AppError(400, "El correo proporcionado ya está en uso");
                }
                
                userUpdateData.pendingEmail = dto.email;
                userUpdateData.isVerified = false;
                emailVerificationRequired = true;
            }

            await userRepository.update(userId, userUpdateData, t);

            // Actualizar preferencias de notificación si se enviaron
            if (dto.notification_preferences) {
                const [prefs, created] = await UserNotificationPreference.findOrCreate({
                    where: { userId },
                    defaults: { ...dto.notification_preferences, userId },
                    transaction: t
                });

                if (!created) {
                    await prefs.update(dto.notification_preferences, { transaction: t });
                }
            }

            await t.commit();

            // Disparamos el correo fuera de la transacción para no bloquear la BD
            if (emailVerificationRequired) {
                await emailVerificationService.createVerificationToken(userId);
                // Aquí llamarías a tu servicio de envío de correos (ej. nodemailer/sendgrid)
            }

            return { 
                message: "Perfil actualizado correctamente", 
                emailVerificationRequired 
            };

        } catch (error) {
            await t.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Error al actualizar el perfil en la base de datos");
        }
    }
}

export default new ProfileService();