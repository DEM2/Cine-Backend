import membershipRepository from "../repositories/membership.repository";
import AppError from "../error/appError";

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
    /**
     * Obtiene los detalles de la membresía activa de un usuario.
     * Implementación para HU-008.
     */
    async getMembershipDetails(userId: number) {
        const membership = await membershipRepository.findByUserId(userId);
        
        if (!membership) {
            throw new AppError(404, "El usuario no posee una membresía activa");
        }
        
        return membership;
    }

    /**
     * Obtiene los beneficios (descuentos y bonos) asociados al nivel de membresía.
     * Implementación para HU-008 (RN-032).
     */
    async getBenefits(userId: number) {
        // 1. Buscamos la membresía y el nivel actual del usuario
        const membership: any = await membershipRepository.findByUserId(userId);
        
        if (!membership) {
            throw new AppError(404, "Membresía no encontrada");
        }

        const levelName = membership.level.name.toUpperCase();

        // 2. RN-032: Resolvemos los descuentos por nivel (Mapeo estático temporal)
        const levelDiscounts: Record<string, string[]> = {
            'BRONCE': ['5% en confitería'],
            'PLATA': ['10% en confitería', 'Lunes 2x1 en boletería'],
            'ORO': ['15% en confitería', 'Lunes y Martes 2x1', 'Fila preferencial'],
            'PLATINO': ['20% en confitería', 'Entradas 2x1 todos los días', 'Parqueadero VIP']
        };

        // 3. TODO: Aquí puedes consultar tu repositorio de Beneficios (Bonos de único uso)
        // const userBonuses = await benefitRepository.findActiveByUserId(userId);
        const userBonuses: any[] = []; 

        return {
            level: levelName,
            discounts: levelDiscounts[levelName] || [],
            availableBonuses: userBonuses
        };
    }
}

export default new MembershipService();