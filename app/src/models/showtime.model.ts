import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Movie from "./movie.model";
import Format from "./format.model";

export interface ShowtimeAttributes {
  id: number;
  movieId: number;
  date: string;
  time: string;
  formatId: number;
  isActive: boolean;
  isSoldOut: boolean;
  complex: string;
}

export interface ShowtimeCreationAttributes extends Optional<ShowtimeAttributes, "id"> {}

class Showtime extends Model<ShowtimeAttributes, ShowtimeCreationAttributes> implements ShowtimeAttributes {
  public id!: number;
  public movieId!: number;
  public date!: string;
  public time!: string;
  public formatId!: number;
  public isActive!: boolean;
  public isSoldOut!: boolean;
  public complex!: string;
}

Showtime.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "movies",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    formatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "formats",
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isSoldOut: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    complex: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Showtime",
    tableName: "showtimes",
    timestamps: true,
  }
);

export default Showtime;