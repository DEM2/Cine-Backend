import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    const now = new Date();

    const demoMovies = [
      {
      
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
      {

  title: "Dune: Part Two",
  original_title: "Dune: Part Two",
  synopsis:
    "Paul Atreides se une a Chani y a los Fremen mientras busca vengarse de quienes destruyeron a su familia.",
  director: "Denis Villeneuve",
  duration_minutes: 166,
  rating: "B15",
  language: "Inglés",
  dubbed: true,
  subtitled: true,
  poster: "dune-part-two.jpg",
  premiere: false,
  audience_rating: 4.8,
  trailer_url: "https://example.com/dune-part-two-trailer.mp4",
  release_date: "2026-11-20",
  is_release: false,
  status: "UPCOMING",
  createdAt: now,
  updatedAt: now,
},
{

  title: "The Batman: Dark Legacy",
  original_title: "The Batman: Dark Legacy",
  synopsis:
    "Batman enfrenta una nueva amenaza que pone a prueba sus límites y el futuro de Gotham City.",
  director: "Matt Reeves",
  duration_minutes: 145,
  rating: "B15",
  language: "Inglés",
  dubbed: true,
  subtitled: true,
  poster: "the-batman-dark-legacy.jpg",
  premiere: true,
  audience_rating: 0,
  trailer_url: "https://example.com/batman-dark-legacy-trailer.mp4",
  release_date: "2027-02-12",
  is_release: false,
  status: "UPCOMING",
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
