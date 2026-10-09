import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Modelo de Reparto (MovieCast)
 * -----------------------------
 * Representa la tabla `movie_cast`.
 *
 * Contiene el elenco de actores de una película. Depende de `movies`
 * mediante una clave foránea `movie_id` (relación muchos a uno).
 *
 * Nota: en el MER `movie_id` es UUID, pero el modelo `Movie` actual
 * usa INTEGER, así que `movieId` queda como INTEGER para que la FK
 * sea compatible con la tabla `movies` existente.
 */

export interface MovieCastAttributes {
  id: number;
  movieId: number;
  actorName: string;
  roleName?: string | null;
}

export interface MovieCastCreationAttributes
  extends Optional<MovieCastAttributes, "id"> {}

class MovieCast
  extends Model<MovieCastAttributes, MovieCastCreationAttributes>
  implements MovieCastAttributes
{
  public id!: number;
  public movieId!: number;
  public actorName!: string;
  public roleName!: string | null;
}

MovieCast.init(
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
    actorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "actor_name",
    },
    roleName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "role_name",
    },
  },
  {
    sequelize,
    modelName: "MovieCast",
    tableName: "movie_cast",
    timestamps: true,
  }
);

export default MovieCast;