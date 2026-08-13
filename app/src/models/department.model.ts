// app/src/models/department.model.ts

/**
 * Modelo de Departamento
 * ----------------------
 * Este archivo define el modelo `Department` de Sequelize, que representa la tabla `departments` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`DepartmentAttributes`).
 *  - Atributos requeridos para la creación (`DepartmentCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Department`.
 */
export interface DepartmentAttributes {
  id: number;
  name: string;
  countryId: number;
}

/**
 * Atributos utilizados para la creación de un nuevo departamento.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, "id"> {}

/**
 * Clase que representa el modelo `Department` en Sequelize.
 *
 * Implementa los atributos definidos en `DepartmentAttributes` y `DepartmentCreationAttributes`.
 */
class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  /** Identificador único del departamento (clave primaria). */
  public id!: number;

  /** Nombre del departamento. */
  public name!: string;

  /** Identificador del país al que pertenece el departamento (clave foránea). */
  public countryId!: number;
}

/**
 * Inicialización del modelo `Department` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio con máximo 100 caracteres.
 * - `countryId`: Clave foránea obligatoria que referencia la tabla `countries`.
 */
Department.init(
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
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "countries",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Department",      // Nombre del modelo en Sequelize
    tableName: "departments",     // Nombre de la tabla en la base de datos
    timestamps: true,            // Incluye createdAt y updatedAt
  }
);

export default Department;
