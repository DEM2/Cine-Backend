import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "snack_products",
      [
        // Crispetas (category_id: 1)
        { id: 1, category_id: 1, name: "Crispetas Pequeñas", description: "Crispetas de maíz tamaño pequeño", price: 9000.00, image_url: "https://ejemplo.com/snacks/crispetas-pequenas.jpg", stock_quantity: 60, is_active: true, created_at: new Date() },
        { id: 2, category_id: 1, name: "Crispetas Grandes", description: "Crispetas de maíz tamaño grande", price: 15000.00, image_url: "https://ejemplo.com/snacks/crispetas-grandes.jpg", stock_quantity: 50, is_active: true, created_at: new Date() },

        // Combos (category_id: 2)
        { id: 3, category_id: 2, name: "Combo Pareja", description: "Crispetas grandes + 2 gaseosas medianas", price: 32000.00, image_url: "https://ejemplo.com/snacks/combo-pareja.jpg", stock_quantity: 30, is_active: true, created_at: new Date() },
        { id: 4, category_id: 2, name: "Combo Individual", description: "Crispetas pequeñas + gaseosa personal", price: 18000.00, image_url: "https://ejemplo.com/snacks/combo-individual.jpg", stock_quantity: 40, is_active: true, created_at: new Date() },

        // Gaseosas (category_id: 3)
        { id: 5, category_id: 3, name: "Gaseosa Personal", description: "Gaseosa 400ml a elección", price: 7000.00, image_url: "https://ejemplo.com/snacks/gaseosa-personal.jpg", stock_quantity: 80, is_active: true, created_at: new Date() },
        { id: 6, category_id: 3, name: "Gaseosa Mediana", description: "Gaseosa 700ml a elección", price: 10000.00, image_url: "https://ejemplo.com/snacks/gaseosa-mediana.jpg", stock_quantity: 70, is_active: true, created_at: new Date() },

        // Dulces (category_id: 4)
        { id: 7, category_id: 4, name: "Gomitas Surtidas", description: "Bolsa de gomitas de frutas surtidas", price: 6000.00, image_url: "https://ejemplo.com/snacks/gomitas.jpg", stock_quantity: 45, is_active: true, created_at: new Date() },
        { id: 8, category_id: 4, name: "Chicles de Menta", description: "Paquete de chicles sabor menta", price: 3000.00, image_url: "https://ejemplo.com/snacks/chicles.jpg", stock_quantity: 100, is_active: true, created_at: new Date() },

        // Chocolates (category_id: 5)
        { id: 9, category_id: 5, name: "Chocolatina Clásica", description: "Chocolatina de leche", price: 4500.00, image_url: "https://ejemplo.com/snacks/chocolatina.jpg", stock_quantity: 90, is_active: true, created_at: new Date() },
        { id: 10, category_id: 5, name: "Chocolate con Almendras", description: "Barra de chocolate con almendras", price: 8500.00, image_url: "https://ejemplo.com/snacks/chocolate-almendras.jpg", stock_quantity: 35, is_active: true, created_at: new Date() },

        // Nachos (category_id: 6)
        { id: 11, category_id: 6, name: "Nachos con Queso", description: "Nachos con salsa de queso cheddar", price: 13000.00, image_url: "https://ejemplo.com/snacks/nachos-queso.jpg", stock_quantity: 25, is_active: true, created_at: new Date() },
        { id: 12, category_id: 6, name: "Nachos Supremos", description: "Nachos con queso, guacamole y pico de gallo", price: 17000.00, image_url: "https://ejemplo.com/snacks/nachos-supremos.jpg", stock_quantity: 20, is_active: true, created_at: new Date() },

        // Perros calientes (category_id: 7)
        { id: 13, category_id: 7, name: "Perro Caliente Clásico", description: "Perro caliente con salsas tradicionales", price: 12000.00, image_url: "https://ejemplo.com/snacks/perro-clasico.jpg", stock_quantity: 30, is_active: true, created_at: new Date() },
        { id: 14, category_id: 7, name: "Perro Caliente Especial", description: "Perro caliente con tocineta y queso", price: 16000.00, image_url: "https://ejemplo.com/snacks/perro-especial.jpg", stock_quantity: 22, is_active: true, created_at: new Date() },

        // Hamburguesas (category_id: 8)
        { id: 15, category_id: 8, name: "Hamburguesa Sencilla", description: "Hamburguesa de carne con vegetales", price: 18000.00, image_url: "https://ejemplo.com/snacks/hamburguesa-sencilla.jpg", stock_quantity: 20, is_active: true, created_at: new Date() },
        { id: 16, category_id: 8, name: "Hamburguesa Doble", description: "Hamburguesa doble carne con queso", price: 24000.00, image_url: "https://ejemplo.com/snacks/hamburguesa-doble.jpg", stock_quantity: 15, is_active: true, created_at: new Date() },

        // Café (category_id: 9)
        { id: 17, category_id: 9, name: "Café Americano", description: "Café negro recién preparado", price: 6000.00, image_url: "https://ejemplo.com/snacks/cafe-americano.jpg", stock_quantity: 50, is_active: true, created_at: new Date() },
        { id: 18, category_id: 9, name: "Capuchino", description: "Café con espuma de leche", price: 8500.00, image_url: "https://ejemplo.com/snacks/capuchino.jpg", stock_quantity: 40, is_active: true, created_at: new Date() },

        // Helados (category_id: 10)
        { id: 19, category_id: 10, name: "Helado de Vainilla", description: "Copa de helado sabor vainilla", price: 9000.00, image_url: "https://ejemplo.com/snacks/helado-vainilla.jpg", stock_quantity: 30, is_active: true, created_at: new Date() },
        { id: 20, category_id: 10, name: "Helado de Chocolate", description: "Copa de helado sabor chocolate", price: 9000.00, image_url: "https://ejemplo.com/snacks/helado-chocolate.jpg", stock_quantity: 0, is_active: true, created_at: new Date() },
      ],
      {
        ignoreDuplicates: true,
      } as any,
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("snack_products", {
      id: Array.from({ length: 20 }, (_, i) => i + 1),
    });
  },
};
