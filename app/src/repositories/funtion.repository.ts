import Showtime from "../models/showtime.model";
import Format from "../models/format.model";
import Room from "../models/complex/room.model";
import {
    IFunctionRepository,
    ShowtimeWithPriceDetails,
} from "./interfaces/funtion.repository.interface";


class FunctionRepository implements IFunctionRepository {

    async findById(functionId: number): Promise<Showtime | null> {
        return await Showtime.findByPk(functionId);
    }

    async findByIdWithPriceDetails(
        functionId: number
    ): Promise<ShowtimeWithPriceDetails | null> {
        return await Showtime.findByPk(functionId, {
            include: [
                { model: Format, as: "format" },
                { model: Room, as: "room" },
            ],
        }) as ShowtimeWithPriceDetails | null;
    }
    
}

export default new FunctionRepository();
