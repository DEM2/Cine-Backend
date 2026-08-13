import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('departments', [
      {
        id: 1,
        name: 'Atlantico',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
      {
        ignoreDuplicates: true
      } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('departments', { id: 1 }, {});
  }
};
