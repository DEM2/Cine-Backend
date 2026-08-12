import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkInsert(
      "document_types",
      [
        {
          id: 1,
          name: "Nit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Cédula de Ciudadanía",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Cédula de Extranjería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Tarjeta de Identidad",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Pasaporte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkDelete(
      "document_types",
      {
        name: [
          "Nit",
          "Cédula de Ciudadanía",
          "Cédula de Extranjería",
          "Tarjeta de Identidad",
          "Pasaporte",
        ],
      },
      {},
    );
  },
};
