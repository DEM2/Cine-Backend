// app/src/repositories/interfaces/role.repository.interface.ts

import Role from "../../models/role.model";

/**
 * Contrato del Repositorio de Roles
 * ----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Role.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IRoleRepository {

    /**
     * Obtiene un rol por su identificador.
     */
    findById(id: number): Promise<Role | null>;

    /**
     * Obtiene un rol por su nombre.
     */
    findByName(name: string): Promise<Role | null>;

    /**
     * Obtiene un rol por su nombre y, si no existe, lo crea.
     * Se utiliza para garantizar que el rol "Natural" siempre esté
     * disponible al registrar un nuevo usuario.
     */
    findOrCreateByName(name: string): Promise<Role>;

}