import { Op, Transaction } from "sequelize";
import CartSeat, { CartSeatCreationAttributes } from "../models/reservations/cart-seat.model";
import { ICartSeatRepository } from "./interfaces/cart-seat.repository.interface";

/**
 * Repositorio de Sillas Bloqueadas en Carrito (CartSeat)
 * --------------------------------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones de
 * persistencia relacionadas con la entidad `CartSeat`.
 */

class CartSeatRepository implements ICartSeatRepository {

  async lockSeats(rows: CartSeatCreationAttributes[], options?: { transaction?: Transaction }): Promise<CartSeat[]>{
    return await CartSeat.bulkCreate(rows, options);
  }

  async releaseSeats(cartId: number, showtimeId: number, seatIds: number[]): Promise<number> {
    const result = await CartSeat.destroy({
      where: {
        cartId,
        showtimeId,
        seatId: { [Op.in]: seatIds }, /** IN */ 
      },
    });
    return result;
  }

  async findLockedByShowtime(showtimeId: number): Promise<CartSeat[]> {
    return await CartSeat.findAll({
      where: { showtimeId },
      attributes: ["seatId", "cartId", "price"],
    });
  }
}

export default new CartSeatRepository();