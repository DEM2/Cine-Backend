// app/src/models/movie-location.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Modelo de Ubicación de Película (MovieLocation)
 * -----------------------------------------------
 * Representa la tabla `movie_locations` según el MER.
 *
 * Define la disponibilidad/distribución de una película por ubicación:
 *  - scope = 'COUNTRY': la película está disponible en TODO el país
 *    (en ese caso `city_id` queda en null).
 *  - scope = 'CITY': la película solo está disponible en la ciudad
 *    indicada (`city_id` obligatorio).
 *
 * Esto permite que el catálogo varíe según el país o la ciudad del
 * complejo de cine donde se consulta.
 */

export interface MovieLocationAttributes {
  /** Clave primaria autoincremental. */
  id: number;
  /** Película distribuida (FK → movies.id). */
  movieId: number;
  /** País de la distribución, siempre requerido (FK → countries.id). */
  countryId: number;
  /**
   * Ciudad específica (FK → cities.id). Solo aplica cuando scope = 'CITY';
   * en distribuciones nacionales queda en null.
   */
  cityId?: number | null;
  /**
   * Discriminador del tipo de distribución:
   *  - 'COUNTRY': disponible en todo el país.
   *  - 'CITY':    disponible únicamente en la ciudad indicada.
   */
  scope: string;
}

export interface MovieLocationCreationAttributes
  extends Optional<MovieLocationAttributes, "id" | "cityId"> {}

class MovieLocation
  extends Model<MovieLocationAttributes, MovieLocationCreationAttributes>
  implements MovieLocationAttributes
{
  public id!: number;
  public movieId!: number;
  public countryId!: number;
  public cityId!: number | null;
  public scope!: string;
}

MovieLocation.init(
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
    countryId: {
      // Siempre requerido: toda distribución pertenece como mínimo a un país.
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "country_id",
      references: {
        model: "countries",
        key: "id",
      },
    },
    cityId: {
      // Opcional: solo se llena cuando scope = 'CITY'.
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "city_id",
      references: {
        model: "cities",
        key: "id",
      },
    },
    scope: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "COUNTRY",
      validate: {
        // Restringe los valores permitidos a nivel de aplicación.
        isIn: [["COUNTRY", "CITY"]],
      },
    },
  },
  {
    sequelize,
    modelName: "MovieLocation",
    tableName: "movie_locations",
    timestamps: true,
    indexes: [
      {
        // Evita duplicar la disponibilidad NACIONAL de una misma película/país.
        name: "uq_movie_country_scope",
        unique: true,
        fields: ["movie_id", "country_id"],
        where: { scope: "COUNTRY" },
      },
      {
        // Evita duplicar la disponibilidad POR CIUDAD de una misma película.
        name: "uq_movie_city_scope",
        unique: true,
        fields: ["movie_id", "city_id"],
        where: { scope: "CITY" },
      },
    ],
  }
);

export default MovieLocation;
