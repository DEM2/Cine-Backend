// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import repository from "../repositories/user.repository";
import cityRepository from "../repositories/city.repository";
import documentTypeRepository from "../repositories/document-type.repository";
import roleRepository from "../repositories/role.repository";
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

const DEFAULT_ROLE_NAME = "MIEMBRO"; // Rol por defecto para todos los usuarios registrados a través de este servicio.
class UserService implements IUserService {

    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        // Verificar si el correo ya existe
        const existingUser = await repository.findByEmail(dto.email);
        if (existingUser) {
            throw new AppError(400, "El correo ya se encuentra registrado");
        }


        // Validar que el tipo de documento exista
        const documentType = await documentTypeRepository.findById(dto.document_type_id);
        if (!documentType) {
            throw new AppError(404, "Tipo de documento no encontrado");
        }

        // Validar que la ciudad exista
        const city = await cityRepository.findById(dto.city_id);
        if (!city) {
            throw new AppError(404, "Ciudad no encontrada");
        }

        // Obtiene el rol "MIEMBRO" (lo crea si aún no existe). Todo usuario
        // registrado a través de este servicio recibe este rol por defecto.
        const role = await roleRepository.findOrCreateByName(DEFAULT_ROLE_NAME);

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Persiste el usuario, mapeando el DTO (snake_case, tal como llega
        // del cliente) a los atributos del modelo (camelCase) y asignando
        // el rol "MIEMBRO" por defecto.
        const user = await repository.create({
            email: dto.email,
            password: hashedPassword,
            documentTypeId: dto.document_type_id,
            documentNumber: dto.document_number,
            firstName: dto.first_name,
            lastName: dto.last_name,
            birthDate: dto.birth_date,
            gender: dto.gender,
            phone: dto.phone,
            address: dto.address,
            cityId: dto.city_id,
            roleId: role.id,
        });

       return  this.toResponseDto(user, role.name);  

    }

    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }


     private toResponseDto(user: User, roleName?: string): UserResponseDto {

        return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            document_type_id: user.documentTypeId,
            document_number: user.documentNumber,
            first_name: user.firstName,
            last_name: user.lastName,
            birth_date: user.birthDate,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
            city_id: user.cityId,
            role_id: user.roleId,
            role: roleName ?? "",
        };

    }
   
}

export default new UserService();