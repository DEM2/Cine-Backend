import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "room_types",
      [
        { id: 1, name: "Estándar", createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: "Ultra", createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: "4DX", createdAt: new Date(), updatedAt: new Date() },
        { id: 4, name: "Kids", createdAt: new Date(), updatedAt: new Date() },
        { id: 5, name: "VIP", createdAt: new Date(), updatedAt: new Date() },
      ],
      {
        ignoreDuplicates: true,
      } as any,
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("room_types", { id: [1, 2, 3, 4, 5] });
  },
};