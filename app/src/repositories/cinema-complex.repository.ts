// app/src/repositories/cinema-complex.repository.ts

import CinemaComplex, { CinemaComplexCreationAttributes } from "../models/cinema-complex.model";
import { ICinemaComplexRepository } from "./interfaces/cinema-complex.repository.interface";

/**
 * Repositorio de Complejos de Cine
 * ---------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad CinemaComplex.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class CinemaComplexRepository implements ICinemaComplexRepository {
  /**
   * Obtiene todos los complejos de cine.
   */
  async findAll(): Promise<CinemaComplex[]> {
    return await CinemaComplex.findAll();
  }

  /**
   * Crea un nuevo complejo de cine.
   */
  async create(data: CinemaComplexCreationAttributes): Promise<CinemaComplex> {
    return await CinemaComplex.create(data);
  }
}

export default new CinemaComplexRepository();