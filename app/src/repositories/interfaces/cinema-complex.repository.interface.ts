import { CinemaComplex } from "../../models/cinema-complex.model";

// interfaz para definir  que funciones debe tener el repository
export interface ICinemaComplexRepository {
    findById(id: number): Promise<CinemaComplex | null>;
}