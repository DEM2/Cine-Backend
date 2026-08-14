
/**
 * Modelo de Sala de Cine
 * ---------------------------
 * Este modelo representa las salas de cine que pertenecen a un complejo.
 * Cada sala tiene un tipo y una capacidad, y su nombre es único por complejo.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `Room`.
 */
export interface RoomAttributes {
  id: number;
  complexId: number;
  roomTypeId: number;
  name: string;
  capacity: number;
  isActive: boolean;
}

/**
 * Atributos utilizados para la creación de una nueva sala.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface RoomCreationAttributes extends Optional<RoomAttributes, "id"> {}

/**
 * Clase que representa el modelo `Room` en Sequelize.
 *
 * Implementa los atributos definidos en `RoomAttributes` y `RoomCreationAttributes`.
 */
class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  /** Identificador único de la sala (clave primaria). */
  public id!: number;

  /** Identificador del complejo de cine al que pertenece la sala (clave foránea). */
  public complexId!: number;

  /** Identificador del tipo de sala (clave foránea). */
  public roomTypeId!: number;

  /** Nombre de la sala, único dentro de su complejo. */
  public name!: string;

  /** Capacidad de la sala (cantidad de asientos). */
  public capacity!: number;

  /** Indica si la sala está activa. */
  public isActive!: boolean;
}

/**
 * Inicialización del modelo `Room` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `complexId`: Clave foránea obligatoria que referencia la tabla `cinema_complexes`.
 * - `roomTypeId`: Clave foránea obligatoria que referencia la tabla `room_types`.
 * - `name`: Nombre obligatorio con máximo 100 caracteres, único por complejo.
 * - `capacity`: Capacidad obligatoria (cantidad de asientos).
 * - `isActive`: Booleano obligatorio con valor por defecto `true`.
 */
Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    complexId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "complex_id",
      references: {
        model: "cinema_complexes",
        key: "id",
      },
    },
    roomTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "room_type_id",
      references: {
        model: "room_types",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "rooms_complex_name_unique",
    },
    capacity: {
      type: DataTypes.INTEGER,
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
    modelName: "Room",           // Nombre del modelo en Sequelize
    tableName: "rooms",          // Nombre de la tabla en la base de datos
    timestamps: true,            // Incluye createdAt y updatedAt
  }
);

export default Room;
