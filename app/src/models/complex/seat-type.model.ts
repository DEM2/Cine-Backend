/**
 * Modelo de Tipo de Silla
 * ---------------------------
 * Este modelo representa los distintos tipos que puede tener una silla dentro
 * de una sala, por ejemplo:
 *  - Estándar
 *  - Preferencial
 *  - Accesible (movilidad reducida)
 *  - Acompañante
 *  - VIP
 *
 * El `extraCharge` se usa para calcular el precio final de la silla:
 * `precio = basePrice del showtime + extraCharge`.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `SeatType`.
 */
export interface SeatTypeAttributes {
  id: number;
  code: string;
  name: string;
  extraCharge: number;
  isActive: boolean;
}

export interface SeatTypeCreationAttributes  extends Optional<SeatTypeAttributes, "id"> { }


class SeatType
  extends Model<SeatTypeAttributes, SeatTypeCreationAttributes>
  implements SeatTypeAttributes {
  /** Identificador único del tipo de silla (clave primaria). */
  public id!: number;

  /** Código único del tipo de silla (Ej. "STANDARD", "VIP"). */
  public code!: string;

  /** Nombre del tipo de silla (Ej. "Estándar", "Preferencial"). */
  public name!: string;

  /** Recargo adicional sobre el precio base del showtime. */
  public extraCharge!: number;

  /** Indica si el tipo de silla está activo. */
  public isActive!: boolean;
}

/**
 * Inicialización del modelo `SeatType` con la configuración de Sequelize.
 */
SeatType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    extraCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: "extra_charge",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    modelName: "SeatType",       // Nombre del modelo en Sequelize
    tableName: "seat_types",     // Nombre de la tabla en la base de datos
    timestamps: true,            // Incluye createdAt y updatedAt
  }
);

export default SeatType;