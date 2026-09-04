import MembershipLevel from "../models/membership-level.model";

// Repositorio de Niveles de Membresía
class MembershipLevelRepository {

    // Busca un nivel de membresía por su nombre.
    // devuelve el nivel de membresía si se encuentra, o null si no se encuentra.
    async findByName(name: string): Promise<MembershipLevel | null> {
        // busca un solo registro donde name coincida con el nombre proporcionado y devuelve el resultado.
        return await MembershipLevel.findOne({
            where: { name }
        });
    }

    // obtiene todos los niveles de membresía disponibles en la base de datos.
    async findAll(): Promise<MembershipLevel[]> {
        // devuelve todos los registros de niveles de membresía sin ningún filtro.
        return await MembershipLevel.findAll();
    }

    // crea un nuevo nivel de membresía con los datos proporcionados.
    async create(data: {
        name: string;
        description: string;
    }): Promise<MembershipLevel> {
        // guarda un nuevo nivel de membresía en la base de datos utilizando el modelo MembershipLevel 
        // y devuelve el registro creado.
        return await MembershipLevel.create(data);
    }
}

export default new MembershipLevelRepository();