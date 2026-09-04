// app/src/models/associations.ts

/**
 * Asociaciones entre modelos
 * ---------------------------
 * Este archivo define las asociaciones entre los modelos de la base de datos.
 *
 * Se importa en `index.ts` antes de ejecutar `sequelize.sync()`, de modo que
 * las columnas de clave foránea y sus restricciones se creen automáticamente.
 */

import CinemaComplex from "./complex/cinema.complex.model";
import RoomType from "./complex/room-type.model";
import Room from "./complex/room.model";
import SnackCategory from "./snack/snack-category.model";
import SnackProduct from "./snack/snack-product.model";
import Membership from "./membership.model";
import UserConsent from "./user-consent.model";
import UserNotificationPreference from "./user-notification-preference.model";
import EmailVerification from "./email-verification.model";
import MembershipLevel from "./membership-level.model";
import SeatType from "./complex/seat-type.model";
import Seat from "./complex/seat.model";
import DocumentType from "./document-type.model";
import Format from "./format.model";
import Genre from "./genre.model";
import City from "./geo_locations/city.model";
import Country from "./geo_locations/country.model";
import Department from "./geo_locations/department.model";
import MovieCast from "./movie-cast.model";
import MovieLocation from "./movie-location.model";
import Movie from "./movie.model";
import CartSeat from "./reservations/cart-seat.model";
import Role from "./role.model";
import Showtime from "./showtime.model";
import User from "./user.model";

/**
 * Un país tiene muchos departamentos (relación uno a muchos).
 */
Country.hasMany(Department, { foreignKey: "countryId", as: "departments" });

/**
 * Un departamento pertenece a un único país (relación muchos a uno).
 */
Department.belongsTo(Country, { foreignKey: "countryId", as: "country" });

/**
 * Un departamento tiene muchas ciudades (relación uno a muchos).
 */
Department.hasMany(City, { foreignKey: "departmentId", as: "cities" });

/**
 * Una ciudad pertenece a un único departamento (relación muchos a uno).
 */
City.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

//relacion entre peliculas y funciones
Movie.hasMany(Showtime, { foreignKey: "movieId", as: "showtimes" });
Showtime.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

// relacion entre peliculas y su reparto (cast)
Movie.hasMany(MovieCast, { foreignKey: "movieId", as: "cast" });
MovieCast.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

// relacion entre funciones y formatos
Showtime.belongsTo(Format, { foreignKey: "formatId", as: "format" });
Format.hasMany(Showtime, { foreignKey: "formatId", as: "showtimes" });

// relacion entre funciones y salas
Showtime.belongsTo(Room, { foreignKey: "roomId", as: "room" });
Room.hasMany(Showtime, { foreignKey: "roomId", as: "showtimes" });

/**
 * Una ciudad puede tener muchos usuarios residentes en ella (relación uno a muchos).
 */
City.hasMany(User, { foreignKey: "cityId", as: "users" });

/**
 * Una ciudad tiene muchos complejos de cine (relación uno a muchos).
 */
City.hasMany(CinemaComplex, { foreignKey: "cityId", as: "cinemaComplexes" });

/**
 * Un complejo de cine pertenece a una única ciudad (relación muchos a uno).
 */
CinemaComplex.belongsTo(City, { foreignKey: "cityId", as: "city" });

/**
 * Un complejo de cine tiene muchas salas (relación uno a muchos).
 */
CinemaComplex.hasMany(Room, { foreignKey: "complexId", as: "rooms" });

/**
 * Una sala pertenece a un único complejo de cine (relación muchos a uno).
 */
Room.belongsTo(CinemaComplex, { foreignKey: "complexId", as: "complex" });

/**
 * Un tipo de sala puede tener muchas salas (relación uno a muchos).
 */
RoomType.hasMany(Room, { foreignKey: "roomTypeId", as: "rooms" });

/**
 * Una sala pertenece a un único tipo de sala (relación muchos a uno).
 */
Room.belongsTo(RoomType, { foreignKey: "roomTypeId", as: "roomType" });

/**
 * una categoria de confiteria puede tener muchos productos (relación uno a muchos)
 */
SnackCategory.hasMany(SnackProduct, { foreignKey: "categoryId", as: "products"});

/**
 * un producto de confiteria pertenece a una unica categoria (relación muchos a uno)
 */
SnackProduct.belongsTo(SnackCategory, { foreignKey: "categoryId", as: "category"});
 /* Un tipo de silla puede tener muchas sillas (relación uno a muchos).
 */
SeatType.hasMany(Seat, { foreignKey: "seatTypeId", as: "seats" });

/**
 * Una silla pertenece a un único tipo de silla (relación muchos a uno).
 */
Seat.belongsTo(SeatType, { foreignKey: "seatTypeId", as: "seatType" });

/**
 * Una sala tiene muchas sillas (relación uno a muchos).
 */
Room.hasMany(Seat, { foreignKey: "roomId", as: "seats" });

/**
 * Una silla pertenece a una única sala (relación muchos a uno).
 */
Seat.belongsTo(Room, { foreignKey: "roomId", as: "room" });

/**
 * Un usuario pertenece a una única ciudad (relación muchos a uno).
 */
User.belongsTo(City, { foreignKey: "cityId", as: "city" });

/**
 * Un tipo de documento puede estar asociado a muchos usuarios (relación uno a muchos).
 */
DocumentType.hasMany(User, { foreignKey: "documentTypeId", as: "users" });

/**
 * Un usuario pertenece a un único tipo de documento (relación muchos a uno).
 */
User.belongsTo(DocumentType, {
  foreignKey: "documentTypeId",
  as: "documentType",
});

/**
 * Un rol puede estar asociado a muchos usuarios (relación uno a muchos).
 */
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

/**
 * Un usuario pertenece a un único rol (relación muchos a uno).
 * Todo usuario creado a través del registro público recibe por defecto el rol "Natural".
 */
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// MEMBERSHIP ASSOCIATIONS
/**
 * Un usuario puede tener una única membresía (relación uno a uno).
 */
User.hasOne(Membership, { foreignKey: "userId", as: "membership" });

/**
 * Una membresía pertenece a un único usuario (relación muchos a uno).
 */
Membership.belongsTo(User, { foreignKey: "userId", as: "user" });

// CONSENT ASSOCIATIONS
/**
 * Un usuario puede tener muchos consentimientos (relación uno a muchos).
 */
User.hasMany(UserConsent, { foreignKey: "userId", as: "consents" });

/**
 * Un consentimiento pertenece a un único usuario (relación muchos a uno).
 */
UserConsent.belongsTo(User, { foreignKey: "userId", as: "user" });

// PREFERENCE ASSOCIATIONS
/**
 * Un usuario puede tener una única preferencia de notificación (relación uno a uno).
 */
User.hasOne(UserNotificationPreference, { foreignKey: "userId", as: "notificationPreference" });

/**
 * Una preferencia de notificación pertenece a un único usuario (relación muchos a uno).
 */
UserNotificationPreference.belongsTo(User, { foreignKey: "userId", as: "user" });

// EMAIL VERIFICATION ASSOCIATIONS
/**
 * Un usuario puede tener muchos códigos de verificación de correo electrónico (relación uno a muchos).
 */
User.hasMany(EmailVerification, { foreignKey: "userId", as: "emailVerifications" });

/**
 * Un código de verificación de correo electrónico pertenece a un único usuario (relación muchos a uno).
 */
EmailVerification.belongsTo(User, { foreignKey: "userId", as: "user" });

// MEMBERSHIP LEVEL ASSOCIATIONS
/**
 * Un nivel de membresía puede tener muchas membresías (relación uno a muchos).
 */
MembershipLevel.hasMany(Membership, { foreignKey: "levelId", as: "memberships" });

/**
 * Una membresía pertenece a un único nivel de membresía (relación muchos a uno).
 */
Membership.belongsTo(MembershipLevel, { foreignKey: "levelId", as: "level" });
// associations.ts
import UpcomingMovieNotification from "./upcoming-movie-notification.model";

User.hasMany(UpcomingMovieNotification, {
  foreignKey: "userId",
  as: "notifications",
});
UpcomingMovieNotification.belongsTo(User, { foreignKey: "userId", as: "user" });
Movie.hasMany(UpcomingMovieNotification, {
  foreignKey: "movieId",
  as: "upcomingNotifications",
});
UpcomingMovieNotification.belongsTo(Movie, {
  foreignKey: "movieId",
  as: "movie",
});

/**
 * Un movie tiene muchos showtimes (relación uno a muchos).
 */

/**
 * Un showtime pertenece a un único movie (relación muchos a uno).
 */

/**
 * Una silla bloqueada en carrito pertenece a una única función (muchos a uno).
 */
CartSeat.belongsTo(Showtime, { foreignKey: "showtimeId", as: "showtime" });

/**
 * Una silla bloqueada en carrito pertenece a una única silla (muchos a uno).
 */
CartSeat.belongsTo(Seat, { foreignKey: "seatId", as: "seat" });

Movie.belongsToMany(Genre, {
  through: "movie_genres",
  foreignKey: "movieId",
  otherKey: "genreId",
  as: "genres",
});

Genre.belongsToMany(Movie, {
  through: "movie_genres",
  foreignKey: "genreId",
  otherKey: "movieId",
  as: "movies",
});

/**
 * Una película puede estar disponible en varias ubicaciones (países o ciudades).
 * El discriminador `scope` define si la disponibilidad es nacional o por ciudad.
 */
Movie.hasMany(MovieLocation, { foreignKey: "movieId", as: "locations" });
MovieLocation.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

Country.hasMany(MovieLocation, {
  foreignKey: "countryId",
  as: "movieLocations",
});
MovieLocation.belongsTo(Country, { foreignKey: "countryId", as: "country" });

City.hasMany(MovieLocation, { foreignKey: "cityId", as: "movieLocations" });
MovieLocation.belongsTo(City, { foreignKey: "cityId", as: "city" });


export { Country, Department, City, Role, DocumentType, User, Genre, Movie, Showtime, Format };
export { CinemaComplex };
export { RoomType };
export { Room };
export { SeatType };
export { Seat };
export { MovieCast };
export {SnackCategory, SnackProduct}
export { UpcomingMovieNotification };
export { MovieLocation };
export {
  Membership,
  MembershipLevel,
  UserConsent,
  UserNotificationPreference,
  EmailVerification,
};
