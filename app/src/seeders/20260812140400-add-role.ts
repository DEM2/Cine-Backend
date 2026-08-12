import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up (queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Visitante',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Usuario',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Administrador',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});
  },

  async down (queryInterface: QueryInterface, sequelize: Sequelize) {
     await queryInterface.bulkDelete('roles', { id: [1, 2, 3] }, {});
  }
};
