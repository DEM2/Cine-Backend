import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Modelo de Función (Showtime)
 * ----------------------------
 * Representa la tabla `showtimes`.
 *
 * Por ahora solo `movieId` tiene foreign key hacia `movies`.
 * `roomId` y `formatId` se guardan como enteros sin FK
 * (las tablas rooms/formats aún no se crean).
 *
 * Nota: en el MER `id` y `movie_id` son UUID; el model `Movie`
 * actual usa INTEGER, así que `movieId` queda como INTEGER
 * para que la FK sea compatible con la tabla `movies` existente.
 */

export interface ShowtimeAttributes {
  id: number;
  movieId: number;
  roomId: number;
  formatId: number;
  language: string;
  isSubtitled: boolean;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  availableSeats: number;
  isActive: boolean;
  createdAt?: Date;
}

export interface ShowtimeCreationAttributes
  extends Optional<ShowtimeAttributes, "id" | "createdAt"> {}

class Showtime
  extends Model<ShowtimeAttributes, ShowtimeCreationAttributes>
  implements ShowtimeAttributes
{
  public id!: number;
  public movieId!: number;
  public roomId!: number;
  public formatId!: number;
  public language!: string;
  public isSubtitled!: boolean;
  public startTime!: Date;
  public endTime!: Date;
  public basePrice!: number;
  public availableSeats!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
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
      field: "movie_id",
      references: {
        model: "movies",
        key: "id",
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "room_id",
    },
    formatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "format_id",
    },
    language: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    isSubtitled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_subtitled",
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_time",
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_time",
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "base_price",
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "available_seats",
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
    modelName: "Showtime",
    tableName: "showtimes",
    timestamps: true,

  }
  
);

export default Showtime;
