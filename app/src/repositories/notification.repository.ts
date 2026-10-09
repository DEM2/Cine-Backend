// app/src/repositories/notification.repository.ts

import UpcomingMovieNotification, {
    UpcomingMovieNotificationCreationAttributes,
} from "../models/upcoming-movie-notification.model";
import Movie from "../models/movie.model";
import User from "../models/user.model";
import { INotificationRepository } from "./interfaces/notification.repository.interface";

/**
 * Repositorio de Notificaciones de Próximos Estrenos
 * --------------------------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad UpcomingMovieNotification.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 *
 * Reglas de negocio soportadas:
 *  - RN-019: findOne() permite detectar solicitudes duplicadas antes de crear.
 *  - RN-020: findPendingByMovie() entrega las solicitudes pendientes de
 *    correo cuando la película entra en cartelera.
 */
class NotificationRepository implements INotificationRepository {

    /**
     * Busca la solicitud de notificación de un usuario para una película.
     * RN-019: si existe un registro, el usuario ya solicitó la notificación.
     */
    async findOne(userId: number, movieId: number): Promise<UpcomingMovieNotification | null> {
        return await UpcomingMovieNotification.findOne({
            where: { userId, movieId }
        });
    }

    /**
     * Registra una nueva solicitud de notificación.
     */
    async create(data: UpcomingMovieNotificationCreationAttributes): Promise<UpcomingMovieNotification> {
        return await UpcomingMovieNotification.create(data);
    }

    /**
     * Obtiene todas las solicitudes de un usuario con los datos básicos
     * de la película asociada.
     *
     * El include con alias "movie" (definido en associations.ts) agrega
     * id, título, póster, fecha y estado de cada película para que el
     * frontend pueda pintar las tarjetas sin hacer una consulta extra.
     * Se ordena por fecha de creación descendente (lo más reciente primero).
     */
    async findByUser(userId: number): Promise<UpcomingMovieNotification[]> {
        return await UpcomingMovieNotification.findAll({
            where: { userId },
            include: [
                {
                    model: Movie,
                    as: "movie",
                    attributes: ["id", "title", "poster", "release_date", "status"],
                }
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    /**
     * Busca una solicitud específica de un usuario.
     * El filtro por userId garantiza que cada usuario solo vea sus propias solicitudes.
     */
    async findByIdAndUser(id: number, userId: number): Promise<UpcomingMovieNotification | null> {
        return await UpcomingMovieNotification.findOne({
            where: { id, userId },
            include: [
                {
                    model: Movie,
                    as: "movie",
                    attributes: ["id", "title", "poster", "release_date", "status"],
                }
            ],
        });
    }

    /**
     * Obtiene las solicitudes pendientes de una película junto al correo
     * del usuario. Se usa en RN-020 cuando la película pasa a En Cartelera.
     */
    async findPendingByMovie(movieId: number): Promise<UpcomingMovieNotification[]> {
        return await UpcomingMovieNotification.findAll({
            where: { movieId, notified: false },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email"],
                }
            ],
        });
    }
}

export default new NotificationRepository();
