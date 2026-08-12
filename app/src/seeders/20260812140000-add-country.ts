import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up (queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkInsert('countries', [
      {
        id:1,
        name: 'Colombia',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});
  },

  async down (queryInterface: QueryInterface, sequelize: Sequelize) {
     await queryInterface.bulkDelete('countries', {name:'Colombia'}, {});
  }
};
