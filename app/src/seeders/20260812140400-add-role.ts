import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Miembro',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Administrador',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
      {
        ignoreDuplicates: true
      } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('roles', { id: [1, 2, 3] }, {});
  }
};