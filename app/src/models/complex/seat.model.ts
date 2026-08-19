/**
 * Modelo de Silla
 * ---------------------------
 * Este modelo representa las sillas que conforman una sala de cine.
 * Cada silla pertenece a una sala (`Room`), tiene un tipo (`SeatType`) y una
 * posición física dentro de la sala (fila y número).
 *
 * El estado transitorio de la silla por función (disponible, seleccionada,
 * reservada temporalmente, vendida) se manejará en una etapa posterior mediante
 * la tabla de bloqueos/reservaciones; `isEnabled` representa aquí si la silla
 * está habilitada físicamente (estado "inhabilitada").
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Atributos principales de la entidad `Seat`.
 */
export interface SeatAttributes {
  id: number;
  roomId: number;
  seatTypeId: number;
  rowLabel: string;
  seatNumber: number;
  code: string;
  isEnabled: boolean;
}

/**
 * Atributos utilizados para la creación de una nueva silla.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface SeatCreationAttributes extends Optional<SeatAttributes, "id"> {}

/**
 * Clase que representa el modelo `Seat` en Sequelize.
 *
 * Implementa los atributos definidos en `SeatAttributes` y `SeatCreationAttributes`.
 */
class Seat
  extends Model<SeatAttributes, SeatCreationAttributes>
  implements SeatAttributes
{
  /** Identificador único de la silla (clave primaria). */
  public id!: number;

  /** Identificador de la sala a la que pertenece la silla (clave foránea). */
  public roomId!: number;

  /** Identificador del tipo de silla (clave foránea). */
  public seatTypeId!: number;

  /** Etiqueta de la fila de la silla (Ej. "A", "B", "C"). */
  public rowLabel!: string;

  /** Número de la silla dentro de su fila. */
  public seatNumber!: number;

  /** Código legible de la silla (Ej. "A-1"). */
  public code!: string;

  /** Indica si la silla está habilitada físicamente. */
  public isEnabled!: boolean;
}

/**
 * Inicialización del modelo `Seat` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `roomId`: Clave foránea obligatoria que referencia la tabla `rooms`.
 * - `seatTypeId`: Clave foránea obligatoria que referencia la tabla `seat_types`.
 * - `rowLabel`: Etiqueta de fila obligatoria con máximo 5 caracteres.
 * - `seatNumber`: Número de silla obligatorio dentro de la fila.
 * - `code`: Código legible obligatorio con máximo 10 caracteres.
 * - `isEnabled`: Booleano obligatorio con valor por defecto `true`.
 */
Seat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "room_id",
      references: {
        model: "rooms",
        key: "id",
      },
    },
    seatTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "seat_type_id",
      references: {
        model: "seat_types",
        key: "id",
      },
    },
    rowLabel: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: "row_label",
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "seat_number",
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_enabled",
    },
  },
  {
    sequelize,
    modelName: "Seat",       // Nombre del modelo en Sequelize
    tableName: "seats",      // Nombre de la tabla en la base de datos
    timestamps: true,        // Incluye createdAt y updatedAt
    indexes: [
      {
        unique: true,
        name: "seats_room_row_seat_unique",
        fields: ["room_id", "row_label", "seat_number"],
      },
    ],
  }
);

export default Seat;