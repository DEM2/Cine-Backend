import Membership, {MembershipCreationAttributes} from "../models/membership.model";
import MembershipLevel from "../models/membership-level.model";
import { IMembershipRepository } from "./interfaces/membership.repository.interface";

class MembershipRepository implements IMembershipRepository {

    /**
     * Crea una nueva membresía.
     */
    async create(
        data: MembershipCreationAttributes
    ): Promise<Membership> {

        return await Membership.create(data);
    }
    /**
     * Obtiene la membresía activa de un usuario incluyendo los datos de su nivel.
     * Implementado para la HU-008.
     */
    async findByUserId(userId: number): Promise<Membership | null> {
        return await Membership.findOne({
            where: { userId },
            include: [{ model: MembershipLevel, as: "level" }]
        });
    }

}

export default new MembershipRepository();
