import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('cinema_complexes', [
      {
        id: 1,
        city_id: 1,
        name: 'Multicine Viva',
        address: 'Carrera 51B #87-50',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        city_id: 1,
        name: 'Multicine Portal Del Prado',
        address: 'Calle 53 #46-192',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
      {
        ignoreDuplicates: true
      } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('cinema_complexes', { id: [1, 2] }, {});
  }
};