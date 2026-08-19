// app/src/services/interfaces/user.service.interface.ts

import User from "../../models/user.model";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UserResponseDto } from "../../dto/user-response.dto";
import { SetUserLocationDto } from "../../dto/set-user-location.dto";

/**
 * Contrato del Servicio de Usuarios.
 */

export interface IUserService {

    create(dto: CreateUserDto): Promise<UserResponseDto>;

    findAll(): Promise<User[]>;

    /**
     * Valida y confirma la ubicación seleccionada por el visitante (HU-002).
     *
     * @param dto - Datos de la ubicación seleccionada.
     */
    setLocation(dto: SetUserLocationDto): Promise<{ message: string }>;

}