import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "formats",
      [
        {
          id: 1,
          name: "2D",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "3D",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "IMAX",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "VIP",
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
    await queryInterface.bulkDelete("formats", { id: [1, 2, 3, 4] });
  },
};
