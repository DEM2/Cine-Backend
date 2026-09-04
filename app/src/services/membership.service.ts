import membershipRepository from "../repositories/membership.repository";

// Servicio de Membresía
class MembershipService {

    // Crea una nueva membresía para un usuario dado y un nivel de membresía específico.
    async create(userId: number, levelId: number) {

        // Genera un número de membresía único basado en la marca de tiempo actual (un numero ej: MEM-123456789).
        const membershipNumber = `MEM-${Date.now()}`;

        // Crea la nueva membresía en la base de datos utilizando el repositorio de membresías.
        const membership = await membershipRepository.create({
            userId,
            levelId,
            membershipNumber,
            // cuando se crea una nueva membresía, se inicializa con 0 puntos y un estado activo.
            currentPoints: 0,
            status: "ACTIVA"
        });

        return membership;
    }
}

export default new MembershipService();