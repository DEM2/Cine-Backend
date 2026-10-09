import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('genres', [
      {
        id: 1,
        name: 'Acción',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Aventura',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Comedia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Drama',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Terror',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: 'Ciencia ficción',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: 'Romance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: 'Animación',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: 'Fantasía',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: 'Suspenso',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: 'Musical',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        name: 'Documental',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {
      ignoreDuplicates: true
    } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('genres', { id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, {});
  }
};