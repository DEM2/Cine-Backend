import Seat from "../../models/complex/seat.model";

/**
 * Contrato del Repositorio de Sillas (Seat)
 */

export interface ISeatRepository {

  /**
   * Obtiene las sillas habilitadas de una sala, incluyendo su tipo
   */
  findEnabledByRoomWithType(roomId: number): Promise<Seat[]>;
}