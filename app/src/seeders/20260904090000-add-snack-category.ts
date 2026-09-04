import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "snack_categories",
      [
        { id: 1, name: "Crispetas", description: "Crispetas de maíz en distintos tamaños y sabores", createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: "Combos", description: "Combos que incluyen crispetas, bebida y otros productos", createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: "Gaseosas", description: "Bebidas gaseosas en diferentes tamaños", createdAt: new Date(), updatedAt: new Date() },
        { id: 4, name: "Dulces", description: "Dulces y confites variados", createdAt: new Date(), updatedAt: new Date() },
        { id: 5, name: "Chocolates", description: "Chocolates y golosinas de chocolate", createdAt: new Date(), updatedAt: new Date() },
        { id: 6, name: "Nachos", description: "Nachos con distintas salsas y toppings", createdAt: new Date(), updatedAt: new Date() },
        { id: 7, name: "Perros calientes", description: "Perros calientes con distintos acompañamientos", createdAt: new Date(), updatedAt: new Date() },
        { id: 8, name: "Hamburguesas", description: "Hamburguesas sencillas y con adiciones", createdAt: new Date(), updatedAt: new Date() },
        { id: 9, name: "Café", description: "Bebidas calientes a base de café", createdAt: new Date(), updatedAt: new Date() },
        { id: 10, name: "Helados", description: "Helados y postres fríos", createdAt: new Date(), updatedAt: new Date() },
      ],
      {
        ignoreDuplicates: true,
      } as any,
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("snack_categories", {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
