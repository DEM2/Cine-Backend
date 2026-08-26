import Showtime from "../models/showtime.model";
import { IFunctionRepository } from "./interfaces/funtion.repository.interface";


class FunctionRepository implements IFunctionRepository {

    async findById(functionId: number): Promise<Showtime | null> {
        return await Showtime.findByPk(functionId);
    }
    
}

export default new FunctionRepository();
