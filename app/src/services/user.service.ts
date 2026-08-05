// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto } from "../dto/create-user.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";
import AppError from "../error/appError";
import bcrypt from "bcrypt";

/**
 * Servicio de Usuarios
 * --------------------
 * Contiene toda la lógica de negocio relacionada con la entidad User.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre uno o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * Ejemplos de reglas de negocio:
 *
 *  Verificar que el correo electrónico no exista antes de crear el usuario.
 *  Validar que el dominio del correo pertenezca a la empresa.
 *  Encriptar la contraseña antes de almacenarla.
 *  Asignar un rol por defecto (Ej. "CLIENTE").
 *  Registrar un log de auditoría de la operación.
 *  Enviar un correo de bienvenida después del registro.
 *  Crear automáticamente un perfil asociado al usuario.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */


class UserService implements IUserService {

    async create(dto: CreateUserDto): Promise<User> {

        // Verificar si el correo ya existe
        const existingUser = await repository.findByEmail(dto.email);

        if (existingUser) {
            throw new AppError(400, "El correo ya se encuentra registrado");
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Crear un nuevo objeto con la contraseña encriptada
        const user = {
            ...dto,
            password: hashedPassword
        };

        return await repository.create(user);
    }

    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }
}

export default new UserService();