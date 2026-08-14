import { CinemaComplex } from "../models/cinema-complex.model";
import { ICinemaComplexRepository } from "./interfaces/cinema-complex.repository.interface";

// la clase CinemaComplexRepository debe cumplir con lo que exige la interfaz
export class CinemaComplexRepository implements ICinemaComplexRepository {

    async findById(id: number): Promise<CinemaComplex | null> {
        // Busca por primary key al complejo
        return await CinemaComplex.findByPk(id);
    }

}