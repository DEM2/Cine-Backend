import Room from "../models/complex/room.model";

class RoomRepository {

    async findIdsByComplexId(complexId: number): Promise<number[]> {
        const rooms = await Room.findAll({
            where: { complexId },
            attributes: ["id"],
        });

        return rooms.map((room) => room.id);
    }
}

export default new RoomRepository();
