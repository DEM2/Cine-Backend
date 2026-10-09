
/**
 * Modelo de Tipos de Sala
 *
 * Este modelo representa los distintos tipos que puede tener una sala de cine, como por ejemplo:
 *  - Ultra
 *  - 4DX
 *  - Kids
 *  - VIP
 *  - Estándar
 */

import { DataTypes, Model, Optional, QueryInterface } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `RoomType`.
 */
export interface RoomTypeAttributes {
  id: number;
  name: string;
}

export interface RoomTypeCreationAttributes extends Optional<RoomTypeAttributes, "id"> { }

class RoomType extends Model<RoomTypeAttributes, RoomTypeCreationAttributes> implements RoomTypeAttributes {
  /** Identificador único del tipo de sala (clave primaria). */
  public id!: number;

  /** Nombre del tipo de sala (Ej. "Ultra", "4DX", "Kids", "VIP", "Estándar"). */
  public name!: string;
}

RoomType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "RoomType",       // Nombre del modelo en Sequelize
    tableName: "room_types",     // Nombre de la tabla en la base de datos
    timestamps: true,            // Incluye createdAt y updatedAt
  }
);


export default RoomType;