// app/src/models/associations.ts

/**
 * Asociaciones entre modelos
 * ---------------------------
 * Este archivo define las asociaciones entre los modelos de la base de datos.
 *
 * Se importa en `index.ts` antes de ejecutar `sequelize.sync()`, de modo que
 * las columnas de clave foránea y sus restricciones se creen automáticamente.
 */

import Country from "./country.model";
import Department from "./department.model";
import City from "./city.model";
import CinemaComplex from "./cinema-complex.model";

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
 * Una ciudad tiene muchos complejos de cine (relación uno a muchos).
 */
City.hasMany(CinemaComplex, { foreignKey: "cityId", as: "cinemaComplexes" });

/**
 * Un complejo de cine pertenece a una única ciudad (relación muchos a uno).
 */
CinemaComplex.belongsTo(City, { foreignKey: "cityId", as: "city" });

export { Country, Department, City, CinemaComplex };
