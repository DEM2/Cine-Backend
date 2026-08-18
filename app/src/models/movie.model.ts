// app/src/models/movie.model.ts

/**
 * Modelo de Película
 * ------------------
 * Este archivo define el modelo `Movie` de Sequelize, que representa la tabla `movies`
 * en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`MovieAttributes`).
 *  - Atributos requeridos para la creación (`MovieCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Movie`.
 */
export interface MovieAttributes {
  id: number;
  title: string;
  original_title: string;
  synopsis: string;
  director: string;
  duration_minutes: number;
  rating: string;
  language: string;
  dubbed: boolean;
  subtitled: boolean;
  poster: string;
  premiere: boolean;
  audience_rating: number;
  banner_url?: string | null;
  trailer_url: string;
  release_date: Date;
  is_release: boolean;
  status: string;
}

/**
 * Atributos utilizados para la creación de una nueva película.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface MovieCreationAttributes
  extends Optional<MovieAttributes, "id"> {}

/**
 * Clase que representa el modelo `Movie` en Sequelize.
 *
 * Implementa los atributos definidos en `MovieAttributes` y `MovieCreationAttributes`.
 */
class Movie
  extends Model<MovieAttributes, MovieCreationAttributes>
  implements MovieAttributes
{
  /** Identificador único de la película (clave primaria). */
  public id!: number;

  /** Título de la película. */
  public title!: string;

  /** Título original de la película. */
  public original_title!: string;

  /** Sinopsis de la película. */
  public synopsis!: string;

  /** Director de la película. */
  public director!: string;

  /** Duración en minutos. */
  public duration_minutes!: number;

  /** Clasificación de la película. */
  public rating!: string;

  /** Idioma original de la película. */
  public language!: string;

  /** Indica si está disponible doblada. */
  public dubbed!: boolean;

  /** Indica si está disponible subtitulada. */
  public subtitled!: boolean;

  /** URL o ruta del póster oficial. */
  public poster!: string;

  /** Indica si la película es un estreno. */
  public premiere!: boolean;

  /** Calificación promedio otorgada por el público. */
  public audience_rating!: number;
  public banner_url!: string | null;
  public trailer_url!: string;
  public release_date!: Date;
  public is_release!: boolean;
  public status!: string;
}

/**
 * Inicialización del modelo `Movie` con la configuración de Sequelize.
 */
Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    original_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dubbed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    subtitled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    premiere: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    audience_rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    banner_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "banner_url",
    },
    trailer_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "trailer_url",
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "release_date",
    },
    is_release: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_release",
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "ACTIVE",
      field: "status",
    },
  },
  {
    sequelize,
    modelName: "Movie",      // Nombre del modelo en Sequelize
    tableName: "movies",     // Nombre de la tabla en la base de datos
    timestamps: true,        // Incluye createdAt y updatedAt
  }
);

export default Movie;