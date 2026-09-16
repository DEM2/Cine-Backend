/**
 * Desglose del precio de una función antes de seleccionar una silla.
 */
export interface FunctionPriceDto {
  functionId: number;
  currency: "COP";
  basePrice: number;
  format: {
    id: number;
    name: string;
    extraCharge: number;
  };
  room: {
    id: number;
    name: string;
    extraCharge: number;
  };
  totalExtraCharges: number;
  finalPrice: number;
}
