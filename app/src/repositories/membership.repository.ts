import Membership, {
    MembershipCreationAttributes
} from "../models/membership.model";

class MembershipRepository {

    async create(
        data: MembershipCreationAttributes
    ): Promise<Membership> {

        return await Membership.create(data);
    }

}

export default new MembershipRepository();