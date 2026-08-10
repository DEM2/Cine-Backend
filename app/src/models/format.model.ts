import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FormatAttributes {
  id: number;
  name: string;
}

export interface FormatCreationAttributes extends Optional<FormatAttributes, "id"> {}

class Format extends Model<FormatAttributes, FormatCreationAttributes> implements FormatAttributes {
  public id!: number;
  public name!: string;
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
  },
  {
    sequelize,
    modelName: "Format",
    tableName: "formats",
    timestamps: true,
  }
);

export default Format;