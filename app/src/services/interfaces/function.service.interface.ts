import { FunctionDto } from "../../dto/funtion/funtion.dto";
import { FunctionPriceDto } from "../../dto/funtion/function-price.dto";

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

  /** Calcula el precio de la función con los recargos de formato y sala. */
  getPrice(id: number): Promise<FunctionPriceDto>;
}
