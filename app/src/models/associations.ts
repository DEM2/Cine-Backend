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
import Role from "./role.model";
import DocumentType from "./document-type.model";
import User from "./user.model";
import Membership from "./membership.model";
import UserConsent from "./user-consent.model";
import UserNotificationPreference from "./user-notification-preference.model";
import EmailVerification from "./email-verification.model";
import MembershipLevel from "./membership-level.model";

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

export { Country, Department, City, Role, DocumentType, User, Membership, UserConsent, UserNotificationPreference, EmailVerification, MembershipLevel };