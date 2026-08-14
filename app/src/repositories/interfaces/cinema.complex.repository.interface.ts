
import CinemaComplex from "../../models/cinema.complex.model";

export interface ICinemaComplexRepository {
  /**
   * Obtiene todos los complejos de cine activos.
   */
  findAllActive(): Promise<CinemaComplex[]>;

  /**
   * Obtiene los complejos de cine activos de una ciudad.
   *
   * @param cityId - Identificador de la ciudad.
   */
  findByCityId(cityId: number): Promise<CinemaComplex[]>;
}