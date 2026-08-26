/**
 * Modelo de Silla en Carrito (CartSeat)
 */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

export interface CartSeatAttributes {
  id: number;
  cartId: number;
  showtimeId: number;
  seatId: number;
  price: number;
  lockedAt: Date;
  /**
   * Momento en el que expira el bloqueo (RN-039/RN-040).
   * Es el mismo para todas las sillas de un mismo carrito+función:
   * se fija con el primer bloqueo y NO se extiende con bloqueos posteriores.
   */
  expiresAt: Date | null;
}

/**
 * Atributos utilizados para la creación de una nueva `CartSeat`.
 */
export interface CartSeatCreationAttributes extends Optional<CartSeatAttributes, "id" | "lockedAt" | "expiresAt"> {}

class CartSeat  extends Model<CartSeatAttributes, CartSeatCreationAttributes> implements CartSeatAttributes
{
  public id!: number;
  public cartId!: number;
  public showtimeId!: number;
  public seatId!: number;
  public price!: number;
  public readonly lockedAt!: Date;
  public expiresAt!: Date | null;
}

CartSeat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cart_id",
    },
    showtimeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "showtime_id",
      references: {
        model: "showtimes",
        key: "id",
      },
    },
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "seat_id",
      references: {
        model: "seats",
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    lockedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      field: "locked_at",
    },
    expiresAt: {
      type: DataTypes.DATE(3),
      allowNull: true,
      field: "expires_at",
    },
  },
  {
    sequelize,
    modelName: "CartSeat",
    tableName: "cart_seats",
    timestamps: true,
    indexes: [
      {
        unique: true,
        name: "uq_showtime_seat_locked",
        fields: ["showtime_id", "seat_id"],
      },
      {
        name: "idx_cart_seats_showtime",
        fields: ["showtime_id"],
      },
      {
        name: "idx_cart_seats_expires_at",
        fields: ["expires_at"],
      },
    ],
  },
);

export default CartSeat;
