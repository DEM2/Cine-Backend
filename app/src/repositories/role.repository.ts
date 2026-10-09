// app/src/repositories/role.repository.ts

import Role from "../models/role.model";
import { IRoleRepository } from "./interfaces/role.repository.interface";

/**
 * Repositorio de Roles
 * ---------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Role.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class RoleRepository implements IRoleRepository {

    /**
     * Obtiene un rol por su identificador.
     */
    async findById(id: number): Promise<Role | null> {

        return await Role.findByPk(id);

    }

    /**
     * Obtiene un rol por su nombre.
     */
    async findByName(name: string): Promise<Role | null> {

        return await Role.findOne({
            where: { name }
        });

    }

    /**
     * Obtiene un rol por su nombre y, si no existe, lo crea automáticamente.
     */
    async findOrCreateByName(name: string): Promise<Role> {

        const [role] = await Role.findOrCreate({
            where: { name },
            defaults: { name }
        });

        return role;

    }

}

export default new RoleRepository();