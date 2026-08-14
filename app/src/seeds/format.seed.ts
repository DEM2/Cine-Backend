// app/src/seeds/format.seed.ts

/**
 * Seed de Formatos
 * ----------------
 * Inicializa la tabla de formatos con datos predeterminados.
 * 
 * Formatos de cine estándar:
 *  - 2D: Formato estándar bidimensional
 *  - 3D: Formato tridimensional
 *  - IMAX: Formato de pantalla gigante
 *  - VIP: Formato con asientos premium
 *  - 4DX: Formato con efectos de movimiento
 */

import Format from "../models/format.model";

const DEFAULT_FORMATS = [
  { name: "2D" },
  { name: "3D" },
  { name: "IMAX" },
  { name: "VIP" },
  { name: "4DX" },
];

/**
 * Inserta los formatos por defecto en la base de datos si no existen.
 */
export const seedFormats = async (): Promise<void> => {
  try {
    // Verificar cuántos formatos existen
    const count = await Format.count();

    if (count === 0) {
      console.log("Inicializando formatos de cine...");
      await Format.bulkCreate(DEFAULT_FORMATS);
      console.log(`✓ ${DEFAULT_FORMATS.length} formatos creados exitosamente.`);
    } else {
      console.log(`✓ Los formatos ya están inicializados (${count} registros).`);
    }
  } catch (error: any) {
    console.error("Error al inicializar formatos:", error.message);
    throw error;
  }
};
