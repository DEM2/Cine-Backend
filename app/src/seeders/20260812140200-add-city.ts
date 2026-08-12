import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up (queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkInsert('cities', [
      {
        id: 1,
        name: 'Barranquilla',
        department_id: 1,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});
  },

  async down (queryInterface: QueryInterface, sequelize: Sequelize) {
     await queryInterface.bulkDelete('cities', {name:'Barranquilla'}, {});
  }
};
