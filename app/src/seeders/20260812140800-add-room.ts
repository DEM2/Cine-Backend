import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "rooms",
      [
        { id: 1, complex_id: 1, room_type_id: 1, name: "Sala 1", capacity: 150, is_active: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, complex_id: 1, room_type_id: 2, name: "Sala 2", capacity: 120, is_active: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, complex_id: 1, room_type_id: 3, name: "Sala 3", capacity: 100, is_active: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 4, complex_id: 1, room_type_id: 4, name: "Sala 4", capacity: 80, is_active: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 5, complex_id: 1, room_type_id: 5, name: "Sala 5", capacity: 60, is_active: true, createdAt: new Date(), updatedAt: new Date() },
      ],
      {
        ignoreDuplicates: true,
      } as any,
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("rooms", { id: [1, 2, 3, 4, 5] });
  },
};