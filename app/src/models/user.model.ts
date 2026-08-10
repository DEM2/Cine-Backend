// app/src/models/user.model.ts

/**
 * Modelo de Usuario
 * -----------------
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
  id?: number;
  email: string;
  passwordHash: string;
  documentTypeId: number;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  phone: string;
  address: string;
  /*avatarUrl: string; */
  cityId: number;
  favoriteComplexId: number;
  roleId: number;
  status: string;
  /*opcional ya que el usuario puede no tener intentos fallidos */
  failedLoginAttempts?: number;
  /*opcional ya que el usuario puede no tener bloqueo */
  lockoutUntil?: Date | null;
  /*opcional ya que el usuario puede no tener fecha de creación */
  createdAt?: Date;
  /*opcional ya que el usuario puede no tener fecha de actualización */
  updatedAt?: Date;
  
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

  /** Contreseña */
  public passwordHash!: string;

  /** Tipo de documento del usuario. */
  public documentTypeId!: number;

  /** Número de documento del usuario. */
  public documentNumber!: string;

  /** Nombre del usuario. */
  public firstName!: string;

  /** Apellido del usuario. */
  public lastName!: string;

  /** Fecha de nacimiento del usuario. */
  birthDate!: Date;

  /** Género del usuario. */
  public gender!: string;

  /** Número de teléfono del usuario. */
  public phone!: string;

  /** Dirección del usuario. */
  public address!: string;

  /** Identificador de la ciudad del usuario. */
  public cityId!: number;

  /** Identificador del complejo favorito del usuario. */
  public favoriteComplexId!: number;

  /** Identificador del rol del usuario. */
  public roleId!: number;

  /** Estado del usuario. */
  public status!: string;

  /** Número de intentos fallidos de inicio de sesión del usuario. */
  public failedLoginAttempts!: number;

  /** Fecha y hora hasta la cual el usuario está bloqueado. */
  public lockoutUntil!: Date | null;

  /** Fecha de creación del registro del usuario. */
  public createdAt!: Date;

  /** Fecha de última actualización del registro del usuario. */
  public updatedAt!: Date;

}

/**
 * Inicialización del modelo `User` con la configuración de Sequelize.
 * 
 * - `id`: Entero autoincremental, clave primaria.
 * - `firstName`: Nombre obligatorio con máximo 100 caracteres.
 * - `lastName`: Apellido obligatorio con máximo 100 caracteres.
 * - `email`: Correo electrónico único y obligatorio con máximo 100 caracteres.
 * - `passwordHash`: Hash de la contraseña obligatorio con máximo 100 caracteres.
 * - `documentTypeId`: Tipo de documento obligatorio.
 * - `documentNumber`: Número de documento obligatorio con máximo 20 caracteres.      
 * - `birthDate`: Fecha de nacimiento obligatoria.
 * - `gender`: Género obligatorio con máximo 10 caracteres.
 * - `phone`: Teléfono obligatorio con máximo 20 caracteres.
 * - `address`: Dirección obligatoria con máximo 200 caracteres.
 * - `cityId`: Identificador de ciudad obligatorio.
 * - `favoriteComplexId`: Identificador de complejo favorito obligatorio.
 * - `roleId`: Identificador de rol obligatorio.
 * - `status`: Estado obligatorio con máximo 20 caracteres.
 * - `failedLoginAttempts`: Número de intentos fallidos de inicio de sesión, opcional, por defecto 0.
 * - `lockoutUntil`: Fecha y hora hasta la cual el usuario está bloqueado, opcional.
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

    passwordHash: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false,
      field: "password_hash",
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

    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "document_type_id",
    },

    documentNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "document_number",
    },

    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birth_date",
    },

    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "city_id",
    },

    favoriteComplexId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "favorite_complex_id",
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "role_id",
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "failed_login_attempts",
      defaultValue: 0,
    },

    lockoutUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "lockout_until",
    },
    
  },
  {
    sequelize,
    modelName: "User",      // Nombre del modelo en Sequelize
    tableName: "users",     // Nombre de la tabla en la base de datos
    timestamps: true,      // Incluye createdAt y updatedAt
    createdAt: "created_at", // Mapea el campo createdAt a la columna created_at
    updatedAt: "updated_at" // Mapea el campo updatedAt a la columna updated_at
  }
);

export default User;