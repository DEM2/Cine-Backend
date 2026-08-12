import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('countries', [
      {
        id: 1,
        name: 'Colombia',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {
      ignoreDuplicates: true
    } as any); 
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('countries', { id: 1 }, {});
  }
};