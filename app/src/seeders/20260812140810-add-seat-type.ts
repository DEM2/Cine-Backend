import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "seat_types",
      [
        {
          id: 1,
          code: "STANDARD",
          name: "Estándar",
          extra_charge: 0.0,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          code: "PREFERENTIAL",
          name: "Preferencial",
          extra_charge: 5000.0,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          code: "ACCESSIBLE",
          name: "Accesible (movilidad reducida)",
          extra_charge: 0.0,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          code: "COMPANION",
          name: "Acompañante",
          extra_charge: 0.0,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          code: "VIP",
          name: "VIP",
          extra_charge: 12000.0,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        ignoreDuplicates: true,
      } as any,
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("seat_types", { id: [1, 2, 3, 4, 5] });
  },
};