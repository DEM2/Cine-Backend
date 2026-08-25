import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const table = await queryInterface.describeTable("movies");

      if (!table.trailer_url) {
        await queryInterface.addColumn(
          "movies",
          "trailer_url",
          {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "",
          },
          { transaction }
        );
      }

      if (!table.release_date) {
        await queryInterface.addColumn(
          "movies",
          "release_date",
          {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const table = await queryInterface.describeTable("movies");

      if (table.trailer_url) {
        await queryInterface.removeColumn(
          "movies",
          "trailer_url",
          { transaction }
        );
      }

      if (table.release_date) {
        await queryInterface.removeColumn(
          "movies",
          "release_date",
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};