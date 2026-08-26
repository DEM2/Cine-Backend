import MembershipLevel from "../models/membership-level.model";

export async function seedMembershipLevels() {

    const existingBasicLevel =
        await MembershipLevel.findOne({
            where: {
                name: "BASICO"
            }
        });

    if (!existingBasicLevel) {

        await MembershipLevel.create({
            name: "BASICO",
            description:
                "Nivel de membresía básico asignado a los nuevos usuarios"
        });

        console.log(
            "Nivel de membresía BASICO creado correctamente"
        );
    }
}