// app/src/repositories/interfaces/notification.repository.interface.ts

import UpcomingMovieNotification, {
    UpcomingMovieNotificationCreationAttributes,
} from "../../models/upcoming-movie-notification.model";

/**
 * Contrato del Repositorio de Notificaciones de Próximos Estrenos
 * ---------------------------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad
 * UpcomingMovieNotification (HU005).
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface INotificationRepository {

    /**
     * Busca la solicitud de notificación de un usuario para una película.
     * Se usa para validar RN-019 (no duplicar solicitudes).
     */
    findOne(userId: number, movieId: number): Promise<UpcomingMovieNotification | null>;

    /**
     * Registra una nueva solicitud de notificación.
     */
    create(data: UpcomingMovieNotificationCreationAttributes): Promise<UpcomingMovieNotification>;

    /**
     * Obtiene todas las solicitudes de notificación de un usuario,
     * incluyendo los datos básicos de la película.
     */
    findByUser(userId: number): Promise<UpcomingMovieNotification[]>;

    /**
     * Busca una solicitud específica de un usuario por su identificador.
     */
    findByIdAndUser(id: number, userId: number): Promise<UpcomingMovieNotification | null>;

    /**
     * Obtiene las solicitudes pendientes (notified = false) de una película.
     * Se usa para RN-020: envío del correo cuando la película entre en cartelera.
     */
    findPendingByMovie(movieId: number): Promise<UpcomingMovieNotification[]>;
}
