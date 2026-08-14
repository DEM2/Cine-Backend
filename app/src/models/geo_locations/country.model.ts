// app/src/models/country.model.ts

/**
 * Modelo de País
 * --------------
 * Este archivo define el modelo `Country` de Sequelize, que representa la tabla `countries` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`CountryAttributes`).
 *  - Atributos requeridos para la creación (`CountryCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `Country`.
 */
export interface CountryAttributes {
  id: number;
  name: string;
}

/**
 * Atributos utilizados para la creación de un nuevo país.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface CountryCreationAttributes extends Optional<CountryAttributes, "id"> {}

/**
 * Clase que representa el modelo `Country` en Sequelize.
 *
 * Implementa los atributos definidos en `CountryAttributes` y `CountryCreationAttributes`.
 */
class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
  /** Identificador único del país (clave primaria). */
  public id!: number;

  /** Nombre del país. */
  public name!: string;
}

/**
 * Inicialización del modelo `Country` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio con máximo 100 caracteres.
 */
Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Asegura que no haya nombres duplicados
    },
  },
  {
    sequelize,
    modelName: "Country",      // Nombre del modelo en Sequelize
    tableName: "countries",    // Nombre de la tabla en la base de datos
    timestamps: true,         // Incluye createdAt y updatedAt
  }
);

export default Country;
