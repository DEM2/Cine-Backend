// app/src/models/associations.ts

/**
 * Asociaciones entre modelos
 * ---------------------------
 * Este archivo define las asociaciones entre los modelos de la base de datos.
 *
 * Se importa en `index.ts` antes de ejecutar `sequelize.sync()`, de modo que
 * las columnas de clave foránea y sus restricciones se creen automáticamente.
 */

import Country from "./geo_locations/country.model";
import Department from "./geo_locations/department.model";
import City from "./geo_locations/city.model";
import Role from "./role.model";
import DocumentType from "./document-type.model";
import User from "./user.model";
import Movie from "./movie.model";
import Showtime from "./showtime.model";
import Genre from "./genre.model";
import Format from "./format.model";
import CinemaComplex from "./complex/cinema.complex.model";
import RoomType from "./complex/room-type.model";
import Room from "./complex/room.model";

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
User.belongsTo(DocumentType, { foreignKey: "documentTypeId", as: "documentType" });

/**
 * Un rol puede estar asociado a muchos usuarios (relación uno a muchos).
 */
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

/**
 * Un usuario pertenece a un único rol (relación muchos a uno).
 * Todo usuario creado a través del registro público recibe por defecto el rol "Natural".
 */
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

/**
 * Un movie tiene muchos showtimes (relación uno a muchos).
 */
Movie.hasMany(Showtime, { foreignKey: "movieId", as: "showtimes" });

/**
 * Un showtime pertenece a un único movie (relación muchos a uno).
 */
Showtime.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

Movie.belongsToMany(Genre, {
    through: "movie_genres",
    foreignKey: "movieId",
    otherKey: "genreId",
    as: "genres"
});

Genre.belongsToMany(Movie, { 
    through: "movie_genres", 
    foreignKey: "genreId", 
    otherKey: "movieId", 
    as: "movies" 
});


export { Country, Department, City, Role, DocumentType, User, Genre, Movie, Showtime, Format };
export { CinemaComplex };
export { RoomType };
export { Room };
