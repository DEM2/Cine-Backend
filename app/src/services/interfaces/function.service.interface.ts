import { FunctionDto } from "../../dto/funtion/funtion.dto";

/**
 * Contrato de la capa de servicio para las funciones de cine.
 */
export interface IFunctionService {
  /**
   * Busca una función por su identificador numérico.
   *
   * @param id - Identificador de la función recibido en la URL.
   * @throws AppError con estado 404 si la función no existe.
   */
  findById(id: number): Promise<FunctionDto>;
}
