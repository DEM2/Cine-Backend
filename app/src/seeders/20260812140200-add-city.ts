import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('cities', [
      {
        id: 1, name: 'Barranquilla', department_id: 1, is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
      {
        ignoreDuplicates: true
      } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('cities', { id: 1 }, {});
  }
};
