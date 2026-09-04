import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    const now = new Date();

    const demoMovies = [
      {
        id: 1,
        title: "Demo Movie 1",
        original_title: "Demo Movie 1",
        synopsis:
          "Película demo creada por el seeder para poblar dependencias.",
        director: "Demo Director",
        duration_minutes: 100,
        rating: "B",
        language: "Español",
        dubbed: true,
        subtitled: false,
        poster: "demo1.jpg",
        premiere: false,
        audience_rating: 0,
        trailer_url: "https://example.com/trailer1.mp4",
        release_date: now.toISOString().slice(0, 10),
        is_release: true,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: "Demo Movie 2",
        original_title: "Demo Movie 2",
        synopsis: "Segunda película demo creada por el seeder.",
        director: "Demo Director",
        duration_minutes: 120,
        rating: "B15",
        language: "Inglés",
        dubbed: false,
        subtitled: true,
        poster: "demo2.jpg",
        premiere: false,
        audience_rating: 0,
        trailer_url: "https://example.com/trailer2.mp4",
        release_date: "2026-10-01",
        is_release: false,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("movies", demoMovies, {
      ignoreDuplicates: true,
    } as any);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      "movies",
      {
        id: [1, 2],
      } as any,
      {}
    );
  },
};
