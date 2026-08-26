import Seat from "../models/complex/seat.model";
import SeatType from "../models/complex/seat-type.model";
import { ISeatRepository } from "./interfaces/seat.repository.interface";

/**
 * Repositorio de Sillas (Seat)
 */

class SeatRepository implements ISeatRepository {

  async findEnabledByRoomWithType(roomId: number): Promise<Seat[]> {
    return await Seat.findAll({
      where: { roomId, isEnabled: true },
      include: [
        {
          model: SeatType,
          as: "seatType",
          attributes: ["id", "code", "name"],
        },
      ],
    });
  }
}

export default new SeatRepository();