import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("membership_levels", [
      {
        name: "BASICO",
        description: "Nivel de membresía básico asignado a los nuevos usuarios",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {
      ignoreDuplicates: true
    } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("membership_levels", {
      name: ["BASICO"]
    }, {});
  },
};