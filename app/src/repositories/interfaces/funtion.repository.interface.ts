import Showtime from "../../models/showtime.model";

export interface IFunctionRepository {
    /**
     * Obtiene una función por su identificador.
     *
     * @param id - Identificador de la función.
     */
    findById(id: number): Promise<Showtime | null>;

}
