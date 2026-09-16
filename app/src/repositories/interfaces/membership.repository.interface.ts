import Membership, { MembershipCreationAttributes } from "../../models/membership.model";

export interface IMembershipRepository {
    /**
     * Crea una nueva membresía.
     */
    create(data: MembershipCreationAttributes): Promise<Membership>;

    /**
     * Obtiene la membresía activa de un usuario incluyendo los datos de su nivel.
     */
    findByUserId(userId: number): Promise<Membership | null>;
}