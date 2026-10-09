import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FormatAttributes {
  id: number;
  name: string;
  extraCharge: number;
}

export interface FormatCreationAttributes 
extends Optional<FormatAttributes, "id" | "extraCharge" > {}

class Format extends Model<FormatAttributes, FormatCreationAttributes> implements FormatAttributes {
  public id!: number;
  public name!: string;
  public extraCharge!: number;
}

Format.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    extraCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "extra_charge",
    },
  },
  {
    sequelize,
    modelName: "Format",
    tableName: "formats",
    timestamps: true,
  }
);

export default Format;