// app/src/repositories/interfaces/cinema-complex.repository.interface.ts

import CinemaComplex, { CinemaComplexCreationAttributes } from "../../models/cinema-complex.model";

export interface ICinemaComplexRepository {
  /**
   * Obtiene todos los complejos de cine.
   */
  findAll(): Promise<CinemaComplex[]>;

  /**
   * Crea un nuevo complejo de cine.
   *
   * @param data - Atributos necesarios para la creación del complejo.
   */
  create(data: CinemaComplexCreationAttributes): Promise<CinemaComplex>;
}
