// app/src/models/cinema-complex.model.ts

/**
 * Modelo de Complejo de Cine
 * ---------------------------
 * Este archivo define el modelo `CinemaComplex` de Sequelize, que representa la tabla `cinema_complexes` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`CinemaComplexAttributes`).
 *  - Atributos requeridos para la creación (`CinemaComplexCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `CinemaComplex`.
 */
export interface CinemaComplexAttributes {
  id: number;
  cityId: number;
  name: string;
  address: string;
  isActive: boolean;
}

/**
 * Atributos utilizados para la creación de un nuevo complejo de cine.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface CinemaComplexCreationAttributes extends Optional<CinemaComplexAttributes, "id"> {}

/**
 * Clase que representa el modelo `CinemaComplex` en Sequelize.
 *
 * Implementa los atributos definidos en `CinemaComplexAttributes` y `CinemaComplexCreationAttributes`.
 */
class CinemaComplex extends Model<CinemaComplexAttributes, CinemaComplexCreationAttributes> implements CinemaComplexAttributes {
  /** Identificador único del complejo de cine (clave primaria). */
  public id!: number;

  /** Identificador de la ciudad a la que pertenece el complejo (clave foránea). */
  public cityId!: number;

  /** Nombre del complejo de cine. */
  public name!: string;

  /** Dirección del complejo de cine. */
  public address!: string;

  /** Indica si el complejo de cine está activo. */
  public isActive!: boolean;
}

/**
 * Inicialización del modelo `CinemaComplex` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `cityId`: Clave foránea obligatoria que referencia la tabla `cities`.
 * - `name`: Nombre obligatorio con máximo 150 caracteres.
 * - `address`: Dirección obligatoria con máximo 255 caracteres.
 * - `isActive`: Booleano obligatorio con valor por defecto `true`.
 */
CinemaComplex.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "city_id",
      references: {
        model: "cities",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    modelName: "CinemaComplex",      // Nombre del modelo en Sequelize
    tableName: "cinema_complexes",   // Nombre de la tabla en la base de datos
    timestamps: true,                // Incluye createdAt y updatedAt
  }
);

export default CinemaComplex;