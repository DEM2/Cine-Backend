import CinemaComplex from "../models/complex/cinema.complex.model";
import { ICinemaComplexRepository } from "./interfaces/cinema.complex.repository.interface";

/**
 * Repositorio de Complejos de Cine
 */

class CinemaComplexRepository implements ICinemaComplexRepository {
  /**
   * Obtiene todos los complejos de cine activos.
   */
  async findAllActive(): Promise<CinemaComplex[]> {
    return await CinemaComplex.findAll({
      where: { isActive: true },
    });
  }

  /**
   * Obtiene los complejos de cine activos de una ciudad.
   */
  async findByCityId(cityId: number): Promise<CinemaComplex[]> {
    return await CinemaComplex.findAll({
      where: { cityId, isActive: true },
    });
  }
}

export default new CinemaComplexRepository();