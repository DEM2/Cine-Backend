import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // Buscar las películas demo creadas por el seeder de movies
    let [rows]: any = await queryInterface.sequelize.query(
      `SELECT id, title FROM movies WHERE title IN ('Demo Movie 1','Demo Movie 2') ORDER BY id ASC;`
    );
    let movieIds: number[] = (rows || []).map((r: any) => r.id).filter(Boolean);

    // Si no encontró las demos, tomar los primeros dos IDs disponibles
    if (movieIds.length < 2) {
      const [allRows]: any = await queryInterface.sequelize.query(
        `SELECT id FROM movies ORDER BY id ASC LIMIT 2;`
      );
      movieIds = (allRows || []).map((r: any) => r.id).filter(Boolean);
    }

    if (movieIds.length === 0) return; // no hay películas: nothing to seed

    const today = new Date();
    const showtimesData: any[] = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);

      const morning = new Date(date);
      morning.setHours(10, 30, 0, 0);
      const morningEnd = new Date(morning);
      morningEnd.setHours(12, 30, 0, 0);

      const afternoon = new Date(date);
      afternoon.setHours(14, 0, 0, 0);
      const afternoonEnd = new Date(afternoon);
      afternoonEnd.setHours(16, 0, 0, 0);

      const evening = new Date(date);
      evening.setHours(18, 30, 0, 0);
      const eveningEnd = new Date(evening);
      eveningEnd.setHours(20, 30, 0, 0);

      const night = new Date(date);
      night.setHours(21, 0, 0, 0);
      const nightEnd = new Date(night);
      nightEnd.setHours(23, 0, 0, 0);

      const m0 = movieIds[0];
      const m1 = movieIds[1] ?? movieIds[0];

      showtimesData.push(
        {
          movie_id: m0,
          room_id: 1,
          format_id: 1,
          language: 'Español',
          is_subtitled: false,
          start_time: morning,
          end_time: morningEnd,
          base_price: 18000,
          available_seats: 150,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          movie_id: m0,
          room_id: 2,
          format_id: 2,
          language: 'Español',
          is_subtitled: false,
          start_time: afternoon,
          end_time: afternoonEnd,
          base_price: 25000,
          available_seats: 120,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          movie_id: m0,
          room_id: 3,
          format_id: 3,
          language: 'Español',
          is_subtitled: true,
          start_time: evening,
          end_time: eveningEnd,
          base_price: 35000,
          available_seats: dayOffset < 2 ? 50 : 100,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          movie_id: m1,
          room_id: 2,
          format_id: 1,
          language: 'Inglés',
          is_subtitled: true,
          start_time: afternoon,
          end_time: afternoonEnd,
          base_price: 18000,
          available_seats: 120,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          movie_id: m1,
          room_id: 4,
          format_id: 4,
          language: 'Inglés',
          is_subtitled: true,
          start_time: night,
          end_time: nightEnd,
          base_price: 40000,
          available_seats: 80,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    if (showtimesData.length) {
      await queryInterface.bulkInsert('showtimes', showtimesData, { ignoreDuplicates: true } as any);
    }
  },

  async down(queryInterface: QueryInterface) {
    // Eliminar las funciones asociadas a las películas demo
    await queryInterface.sequelize.query(
      `DELETE FROM showtimes WHERE movie_id IN (SELECT id FROM movies WHERE title IN ('Demo Movie 1','Demo Movie 2'));`
    );
  },
};
 