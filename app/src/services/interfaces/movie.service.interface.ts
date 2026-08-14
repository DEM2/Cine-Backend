// app/src/services/interfaces/movie.service.interface.ts

import movie from "../../models/movie.model";
import { CreateMovieDto } from "../../dto/movie/create-movie.dto";

/**
 * Contrato del Servicio de Películas.
 */

export interface IMovieService {

    create(dto: CreateMovieDto): Promise<movie>;

    findAll(): Promise<movie[]>;

}