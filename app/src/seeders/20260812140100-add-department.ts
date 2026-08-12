import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up (queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkInsert('departments', [
      {
        id:1,
        name: 'Atlantico',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});
  },

  async down (queryInterface: QueryInterface, sequelize: Sequelize) {
     await queryInterface.bulkDelete('departments', {name:'Atlantico'}, {});
  }
};
