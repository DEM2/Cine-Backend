import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "movie_locations",
      [
        {
          id: 1,
          movie_id: 1,
          country_id: 1,
          city_id: null,
          scope: "COUNTRY",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 2,
          movie_id: 2,
          country_id: 1,
          city_id: 1,
          scope: "CITY",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {
        ignoreDuplicates: true,
      } as any
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      "movie_locations",
      {
        id: [1, 2],
      } as any,
      {}
    );
  },
};
