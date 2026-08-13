// app/src/models/user.model.ts
/**
 * Modelo de Usuario
 *
 * Este archivo define el modelo `User` de Sequelize, que representa la tabla `users` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`UserAttributes`).
 *  - Atributos requeridos para la creación (`UserCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `User`.
 */
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  documentTypeId: number;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  cityId: number;
  roleId: number;
}

/**
 * Atributos utilizados para la creación de un nuevo usuario.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

/**
 * Clase que representa el modelo `User` en Sequelize.
 *
 * Implementa los atributos definidos en `UserAttributes` y `UserCreationAttributes`.
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  /** Identificador único del usuario (clave primaria). */
  public id!: number;

  /** Dirección de correo electrónico única del usuario. */
  public email!: string;

  /** Contraseña encriptada del usuario. */
  public password!: string;

  /** Identificador del tipo de documento del usuario (clave foránea). */
  public documentTypeId!: number;

  /** Número de documento de identidad, único por usuario. */
  public documentNumber!: string;

  /** Primer nombre / nombres del usuario. */
  public firstName!: string;

  /** Apellidos del usuario. */
  public lastName!: string;

  /** Fecha de nacimiento del usuario (formato YYYY-MM-DD). */
  public birthDate!: string;

  /** Género del usuario. */
  public gender!: string;

  /** Número de teléfono de contacto del usuario. */
  public phone!: string;

  /** Dirección de residencia del usuario. */
  public address!: string;

  /** Identificador de la ciudad de residencia del usuario (clave foránea). */
  public cityId!: number;

  /**
   * Identificador del rol del usuario (clave foránea).
   * Todo usuario creado a través del registro público recibe automáticamente
   * el rol "Natural" (ver `UserService.create`).
   */
  public roleId!: number;
}

/**
 * Inicialización del modelo `User` con la configuración de Sequelize.
 *
 *  - `id`: Entero autoincremental, clave primaria.
 *  - `email`: Correo electrónico único y obligatorio con máximo 100 caracteres.
 *  - `password`: Contraseña encriptada, obligatoria.
 *  - `documentTypeId`: Clave foránea obligatoria que referencia la tabla `document_types`.
 *  - `documentNumber`: Número de documento único y obligatorio.
 *  - `firstName` / `lastName`: Nombres y apellidos obligatorios.
 *  - `birthDate`: Fecha de nacimiento obligatoria.
 *  - `gender`: Género obligatorio.
 *  - `phone`: Teléfono de contacto obligatorio.
 *  - `address`: Dirección de residencia obligatoria.
 *  - `cityId`: Clave foránea obligatoria que referencia la tabla `cities`.
 *  - `roleId`: Clave foránea obligatoria que referencia la tabla `roles`.
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "document_type_id",
      references: {
        model: "document_types",
        key: "id",
      },
    },
    documentNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "document_number",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birth_date",
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: false,
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
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "role_id",
      references: {
        model: "roles",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "User",      // Nombre del modelo en Sequelize
    tableName: "users",     // Nombre de la tabla en la base de datos
    timestamps: true,       // Incluye createdAt y updatedAt
  }
);

export default User;