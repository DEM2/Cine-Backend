import Showtime from "../../models/showtime.model";
import Format from "../../models/format.model";
import Room from "../../models/complex/room.model";

export type ShowtimeWithPriceDetails = Showtime & {
    format?: Format;
    room?: Room;
};

export interface IFunctionRepository {
    /**
     * Obtiene una función por su identificador.
     *
     * @param id - Identificador de la función.
     */
    findById(id: number): Promise<Showtime | null>;

    /** Obtiene la función junto con la sala y el formato para calcular su precio. */
    findByIdWithPriceDetails(id: number): Promise<ShowtimeWithPriceDetails | null>;

}
