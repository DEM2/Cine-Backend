// app/src/models/upcoming-movie-notification.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Modelo de Notificación de Próximo Estreno (UpcomingMovieNotification)
 * --------------------------------------------------------------------
 * Representa la tabla `upcoming_movie_notifications`.
 *
 * Registra la solicitud de un usuario para ser notificado por correo
 * cuando una película próxima a estrenar (HU005) entre en cartelera.
 *
 * Depende de `users` y `movies` mediante claves foráneas
 * `user_id` y `movie_id` (relaciones muchos a uno).
 *
 * RN-019: un usuario no puede registrar más de una solicitud por película.
 * Se garantiza con un índice único compuesto (user_id, movie_id).
 *
 * RN-020: cuando la película pase a estado ACTIVE (En Cartelera) se envía
 * el correo a los registros pendientes; el flag `notified` evita reenvíos.
 */

export interface UpcomingMovieNotificationAttributes {
  /** Clave primaria autoincremental. */
  id: number;
  /** Usuario que solicita el aviso (FK → users.id). */
  userId: number;
  /** Película próxima a estrenar (FK → movies.id). */
  movieId: number;
  /**
   * Flag de RN-020: indica si YA se envió el correo al usuario.
   * Nace en false cuando el usuario solicita la notificación y pasa a
   * true cuando la película entra en cartelera y se le notifica,
   * evitando reenvíos.
   */
  notified: boolean;
}

export interface UpcomingMovieNotificationCreationAttributes
  extends Optional<UpcomingMovieNotificationAttributes, "id" | "notified"> {}

class UpcomingMovieNotification
  extends Model<
    UpcomingMovieNotificationAttributes,
    UpcomingMovieNotificationCreationAttributes
  >
  implements UpcomingMovieNotificationAttributes
{
  public id!: number;
  public userId!: number;
  public movieId!: number;
  public notified!: boolean;
}

UpcomingMovieNotification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
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
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Toda solicitud nace pendiente de notificar.
      field: "notified",
    },
  },
  {
    sequelize,
    modelName: "UpcomingMovieNotification",
    tableName: "upcoming_movie_notifications",
    timestamps: true,
    /**
     * RN-019 (nivel base de datos): índice único compuesto que impide
     * físicamente que un mismo usuario registre dos solicitudes para la
     * misma película. Es la garantía definitiva contra duplicados: aunque
     * el servicio valide antes, si dos peticiones llegaran al tiempo la BD
     * rechazaría la segunda con un error de unicidad.
     *
     * IMPORTANTE: en `fields` van los nombres de COLUMNA de la BD
     * (los valores de `field:`), no los nombres de atributos TypeScript.
     */
    indexes: [
      {
        unique: true,
        fields: ["user_id", "movie_id"],
        name: "uq_upcoming_notification_user_movie",
      },
    ],
  }
);

export default UpcomingMovieNotification;
