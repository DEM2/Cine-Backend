import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface GenreAttributes {
  id: number;
  name: string;
}

export interface GenreCreationAttributes extends Optional<GenreAttributes, "id"> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: number;
  public name!: string;
}

Genre.init(
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
    modelName: "Genre",
    tableName: "genres",
    timestamps: true,
  }
);

export default Genre;