// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import repository from "../repositories/user.repository";
import cityRepository from "../repositories/city.repository";
import documentTypeRepository from "../repositories/document-type.repository";
import roleRepository from "../repositories/role.repository";
import { CinemaComplexRepository } from "../repositories/cinema-complex.repository";
import { IUserService } from "./interfaces/user.service.interface";
import AppError from "../error/appError";
import membershipService from "./membership.service";
import membershipLevelRepository from "../repositories/membership-level.repository";
import emailVerificationService from "./email-verification.service";
import captchaService from "./captcha.service";
import UserConsent from "../models/user-consent.model";
import UserNotificationPreference from "../models/user-notification-preference.model";

/**
 * Rol asignado por defecto a los usuarios registrados.
 */
const DEFAULT_ROLE_NAME = "MIEMBRO";

/**
 * Servicio de Usuarios
 *
 * Contiene la lógica de negocio relacionada con la entidad User.
 *
 * Responsabilidades:
 * - Validar reglas de negocio.
 * - Validar información relacionada con el usuario.
 * - Crear el usuario.
 * - Registrar consentimientos.
 * - Crear preferencias de notificación.
 * - Crear la membresía.
 * - Crear el token de verificación de correo.
 */
class UserService implements IUserService {

    /**
     * Repository de complejos cinematográficos.
     *
     * Se utiliza para comprobar que el complejo favorito
     * seleccionado por el usuario realmente exista.
     */
    private cinemaComplexRepository =
        new CinemaComplexRepository();

    /**
     * Crear un nuevo usuario.
     */
    async create(
        dto: CreateUserDto
    ): Promise<UserResponseDto> {

        // 1. Validar CAPTCHA
        await captchaService.verify(
            dto.captchaToken
        );

        // 2. Verificar que los correos coincidan
        if (
            dto.email !==
            dto.email_confirmation
        ) {
            throw new AppError(
                400,
                "Los correos electrónicos no coinciden"
            );
        }

        // 3. Verificar que las contraseñas coincidan
        if (
            dto.password !==
            dto.password_confirmation
        ) {
            throw new AppError(
                400,
                "Las contraseñas no coinciden"
            );
        }

        // 4. Validar requisitos de contraseña
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;

        if (
            !passwordRegex.test(dto.password)
        ) {
            throw new AppError(
                400,
                "La contraseña debe tener mínimo 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            );
        }

        // 5. Validar consentimiento de tratamiento de datos
        if (!dto.data_processing_consent) {
            throw new AppError(
                400,
                "Debe aceptar el tratamiento de datos personales"
            );
        }

        // 6. Validar términos y condiciones
        if (!dto.terms_and_conditions) {
            throw new AppError(
                400,
                "Debe aceptar los términos y condiciones"
            );
        }

        // 7. Verificar si el correo ya existe
        const existingUser =
            await repository.findByEmail(
                dto.email
            );

        if (existingUser) {
            throw new AppError(
                400,
                "El correo ya se encuentra registrado"
            );
        }

        // 8. Validar que el tipo de documento exista
        const documentType =
            await documentTypeRepository.findById(
                dto.document_type_id
            );

        if (!documentType) {
            throw new AppError(
                404,
                "Tipo de documento no encontrado"
            );
        }

        // 9. Validar que la ciudad exista
        const city =
            await cityRepository.findById(
                dto.city_id
            );

        if (!city) {
            throw new AppError(
                404,
                "Ciudad no encontrada"
            );
        }

        // 10. Validar complejo favorito
        // si fue seleccionado
        if (dto.favorite_complex_id) {

            const complex =
                await this
                    .cinemaComplexRepository
                    .findById(
                        dto.favorite_complex_id
                    );

            if (!complex) {
                throw new AppError(
                    404,
                    "Complejo no encontrado"
                );
            }
        }

        // 11. Obtener el rol por defecto
        const role =
            await roleRepository
                .findOrCreateByName(
                    DEFAULT_ROLE_NAME
                );

        // 12. Buscar el nivel de membresía BASICO
        // ANTES de crear el usuario.
        //
        // Esto evita crear parcialmente un usuario
        // si la configuración de membresía no existe.
        const level =
            await membershipLevelRepository
                .findByName("BASICO");

        if (!level) {
            throw new AppError(
                404,
                "Nivel de membresía BASICO no encontrado"
            );
        }

        /**
         * 13. Crear usuario
         *
         * Se utiliza "password" porque ese es
         * el nombre del atributo en el modelo User.
         *
         * El modelo User se encarga automáticamente
         * de encriptar la contraseña mediante
         * el hook beforeCreate.
         */
        const user =
            await repository.create({
                email: dto.email,

                password:
                    dto.password,

                documentTypeId:
                    dto.document_type_id,

                documentNumber:
                    dto.document_number,

                firstName:
                    dto.first_name,

                lastName:
                    dto.last_name,

                birthDate:
                    dto.birth_date,

                gender:
                    dto.gender,

                phone:
                    dto.phone,

                address:
                    dto.address,

                cityId:
                    dto.city_id,

                roleId:
                    role.id,

                // El correo todavía
                // no ha sido verificado.
                isVerified: false,

                // No existen intentos
                // fallidos inicialmente.
                failedLoginAttempts: 0,

                // La cuenta inicialmente
                // no está bloqueada.
                lockoutUntil: null,

                // La cuenta permanece inactiva
                // hasta confirmar el correo.
                status: "INACTIVO",

                favoriteComplexId:
                    dto.favorite_complex_id,
            });

        // 14. Guardar consentimiento
        // de tratamiento de datos
        await UserConsent.create({
            userId:
                user.id,

            consentType:
                "data_processing",

            accepted:
                dto.data_processing_consent,

            acceptedAt:
                new Date(),
        });

        // 15. Guardar consentimiento
        // de términos y condiciones
        await UserConsent.create({
            userId:
                user.id,

            consentType:
                "terms_and_conditions",

            accepted:
                dto.terms_and_conditions,

            acceptedAt:
                new Date(),
        });

        // 16. Guardar consentimiento
        // de comunicaciones comerciales
        await UserConsent.create({
            userId:
                user.id,

            consentType:
                "commercial_communications",

            accepted:
                dto.commercial_communications
                ?? false,

            acceptedAt:
                dto.commercial_communications
                    ? new Date()
                    : undefined,
        });

        // 17. Crear preferencias
        // de notificaciones
        await UserNotificationPreference.create({
            userId:
                user.id,

            // Correos relacionados
            // con la cuenta.
            transactionalEmail:
                true,

            // Correos promocionales
            // según consentimiento.
            promotionalEmail:
                dto.commercial_communications
                ?? false,

            // No se solicitan
            // durante el registro.
            sms:
                false,

            push:
                false,
        });

        console.log(
            "USUARIO CREADO:",
            user.id
        );

        console.log(
            "NIVEL ENCONTRADO:",
            level.id,
            level.name
        );

        // 18. Crear membresía automáticamente
        await membershipService.create(
            user.id,
            level.id
        );

        console.log(
            "MEMBRESIA CREADA"
        );

        // 19. Crear token
        // de verificación de correo
        const token =
            await emailVerificationService
                .createVerificationToken(
                    user.id
                );

        console.log(
            "TOKEN DE VERIFICACIÓN:",
            token
        );

        // 20. Convertir usuario
        // al DTO de respuesta
        return this.toResponseDto(
            user,
            role.name
        );
    }

    /**
     * Obtener todos los usuarios.
     */
    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }

    /**
     * Convertir User a UserResponseDto.
     */
    private toResponseDto(
        user: User,
        roleName?: string
    ): UserResponseDto {

        return {
            id:
                user.id,

            name:
                `${user.firstName} ${user.lastName}`,

            email:
                user.email,

            document_type_id:
                user.documentTypeId,

            document_number:
                user.documentNumber,

            first_name:
                user.firstName,

            last_name:
                user.lastName,

            birth_date:
                user.birthDate,

            gender:
                user.gender,

            phone:
                user.phone,

            address:
                user.address,

            city_id:
                user.cityId,

            role_id:
                user.roleId,

            role:
                roleName ?? "",

            status:
                user.status,
        };
    }
}

export default new UserService();