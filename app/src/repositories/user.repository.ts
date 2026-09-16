// app/src/repositories/user.repository.ts

import User, { UserCreationAttributes, UserAttributes } from "../models/user.model";
import { IUserRepository } from "./interfaces/user.repository.interface";
import Membership from "../models/membership.model";
import MembershipLevel from "../models/membership-level.model";
import { Transaction } from "sequelize";
import UserNotificationPreference from "../models/user-notification-preference.model";
import Purchase from "../models/purchase.model";

/**
 * Repositorio de Usuarios
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad User.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class UserRepository implements IUserRepository {

    /**
     * Crea un nuevo usuario.
     */
    async create(data: UserCreationAttributes): Promise<User> {

        // crea un nuevo usuario en la base de datos usando los datos de data
        // espera que se cree el usuario y lo devuelve creado
        return await User.create(data);

    }

    /**
     * Obtiene todos los usuarios.
     */
    async findAll(): Promise<User[]> {
        // sequealize consulta la tabla users
        return await User.findAll({
            // ademas de los datos del usuario, trae informacion de otras tablas
            // que estan relacionadas con el 
            include: [
                {
                    // Incluye la membresía asociada al usuario.
                    model: Membership,
                    as: "membership",

                    // Incluye el nivel de esa membresía.
                    include: [
                        {
                            model: MembershipLevel,
                            as: "level"
                        }
                    ]
                }
            ]
        });
    }   
    
     async findByEmail(email: string): Promise<User | null> {
      return await User.findOne({
        where: {
            email: email,
        }
    });
}
/**
     * Obtiene el perfil completo de un usuario con sus relaciones.
     */
    async findProfileById(id: number): Promise<User | null> {
        return await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserNotificationPreference,
                    as: "notificationPreference"
                },
                {
                    model: Membership,
                    as: "membership",
                    include: [{ model: MembershipLevel, as: "level" }]
                },
                {
                    model: Purchase,
                    as: "purchases",
                    limit: 5, 
                    order: [['purchaseDate', 'DESC']] // Trae las 5 compras más recientes
                }
            ]
        });
    }

    /**
     * Actualiza un usuario (Soporta transacciones).
     */
    async update(id: number, data: Partial<UserAttributes>, transaction?: Transaction): Promise<[number]> {
        return await User.update(data, {
            where: { id },
            transaction
        });
    }
    /**
     * Obtiene un usuario por su ID (búsqueda simple).
     */
    async findById(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }

}

export default new UserRepository();