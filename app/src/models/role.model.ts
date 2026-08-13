// app/src/models/role.model.ts

/**
 * Modelo de Rol
 * -------------
 * Este archivo define el modelo `Role` de Sequelize, que representa la tabla `roles` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`RoleAttributes`).
 *  - Atributos requeridos para la creación (`RoleCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo se utiliza para clasificar a los usuarios según su tipo
 * (por ejemplo, "Natural" para toda persona registrada por defecto,
 * o "Administrador" para usuarios con privilegios especiales).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Role`.
 */
export interface RoleAttributes {
  id: number;
  name: string;
}

/**
 * Atributos utilizados para la creación de un nuevo rol.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

/**
 * Clase que representa el modelo `Role` en Sequelize.
 *
 * Implementa los atributos definidos en `RoleAttributes` y `RoleCreationAttributes`.
 */
class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  /** Identificador único del rol (clave primaria). */
  public id!: number;

  /** Nombre del rol (Ej. "Natural"). */
  public name!: string;
}

/**
 * Inicialización del modelo `Role` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio y único con máximo 50 caracteres.
 */
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Role",     // Nombre del modelo en Sequelize
    tableName: "roles",    // Nombre de la tabla en la base de datos
    timestamps: true,      // Incluye createdAt y updatedAt
  }
);

export default Role;