import { QueryInterface } from "sequelize";

// Mapeo de los IDs de tipos de asiento según la base de datos
const SEAT_TYPES = { 
  STANDARD: 1, 
  PREFERENTIAL: 2, 
  ACCESSIBLE: 3, 
  COMPANION: 4, 
  VIP: 5 
};

// Parámetros de configuración de la sala
const ROOM_ID = 1;
const COLUMNS_PER_ROW = 10;
const CAPACITY = 150;

// Cálculo dinámico de filas necesarias (150 / 10 = 15 filas)
const TOTAL_ROWS = Math.ceil(CAPACITY / COLUMNS_PER_ROW);

// Obtiene la letra de la última fila (65 es 'A' en ASCII -> 65 + 15 - 1 = 79, que es 'O')
const LAST_ROW_LETTER = String.fromCharCode(65 + TOTAL_ROWS - 1);

/**
 * Función auxiliar para construir los objetos de todos los asientos
 * como "Estándar" y habilitados por defecto.
 */
function buildAllStandardSeats() {
  const seats: Record<string, unknown>[] = [];

  for (let rowIndex = 0; rowIndex < TOTAL_ROWS; rowIndex++) {
    // Convierte el índice numérico a su equivalente en letra (0 -> A, 1 -> B, etc.)
    const rowLetter = String.fromCharCode(65 + rowIndex);

    // Asegura que la última fila no exceda la capacidad restante si la división no es exacta
    const seatsInRow =
      rowIndex === TOTAL_ROWS - 1 ? CAPACITY - rowIndex * COLUMNS_PER_ROW : COLUMNS_PER_ROW;

    for (let seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
      seats.push({
        room_id: ROOM_ID,
        seat_type_id: SEAT_TYPES.STANDARD,
        row_label: rowLetter,
        seat_number: seatNumber,
        code: `${rowLetter}-${seatNumber}`, // Código amigable (ej: "A-1", "B-5")
        is_enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return seats;
}

export default {
  /**
   * Aplica los cambios a la base de datos (Ejecución de la migración)
   */
  async up(queryInterface: QueryInterface) {
    // 1. Insertar masivamente todos los asientos inicializados como Estándar
    await queryInterface.bulkInsert("seats", buildAllStandardSeats(), {
      ignoreDuplicates: true,
    } as any);

    // 2. Actualizar las filas A y B completas a tipo Preferencial
    await queryInterface.bulkUpdate(
      "seats",
      { seat_type_id: SEAT_TYPES.PREFERENTIAL },
      { room_id: ROOM_ID, row_label: ["A", "B"] }
    );

    // 3. Cambiar los extremos de la fila A (sillas 1 y 10) a tipo Accesible
    await queryInterface.bulkUpdate(
      "seats",
      { seat_type_id: SEAT_TYPES.ACCESSIBLE },
      { room_id: ROOM_ID, row_label: "A", seat_number: [1, COLUMNS_PER_ROW] }
    );

    // 4. Cambiar las sillas contiguas a las accesibles (sillas 2 y 9 de la fila A) a Acompañante
    await queryInterface.bulkUpdate(
      "seats",
      { seat_type_id: SEAT_TYPES.COMPANION },
      { room_id: ROOM_ID, row_label: "A", seat_number: [2, COLUMNS_PER_ROW - 1] }
    );

    // 5. Asignar la última fila completa (Fila O) como tipo VIP
    await queryInterface.bulkUpdate(
      "seats",
      { seat_type_id: SEAT_TYPES.VIP },
      { room_id: ROOM_ID, row_label: LAST_ROW_LETTER }
    );

    // 6. Inhabilitar manualmente asientos específicos fuera de servicio o bloqueados
    await queryInterface.bulkUpdate(
      "seats",
      { is_enabled: false },
      { room_id: ROOM_ID, row_label: "D", seat_number: 4 }
    );
    await queryInterface.bulkUpdate(
      "seats",
      { is_enabled: false },
      { room_id: ROOM_ID, row_label: "H", seat_number: 9 }
    );
  },

  /**
   * Deshace los cambios (Rollback)
   */
  async down(queryInterface: QueryInterface) {
    // Elimina todos los asientos pertenecientes a esta sala
    await queryInterface.bulkDelete("seats", { room_id: ROOM_ID });
  },
};