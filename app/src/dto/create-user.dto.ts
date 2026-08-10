// app/src/dto/create-user.dto.ts

/**
 * DTO - Creación de Usuario
 * -------------------------
 * Este DTO representa la información necesaria para crear un nuevo usuario.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de usuarios.
 *
 * @property {string} name - Nombre completo del usuario.
 * @property {string} email - Dirección de correo electrónico única del usuario.
 *
 * @example
 * const dto: CreateUserDto = {
 *   name: "David Mtz",s
 *   email: "david@example.com"
 * };
 */

/*en la interface no agregamos roleId, status (los controla el sistema), failedLoginAttempts
(empieza en 0), lockoutUntil (el usuario nunca decide cuando se bloque), createdAt, updatedAt (sequelize los crea) */
export interface CreateUserDto {

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    documentTypeId: number;

    documentNumber: string;

    birthDate: Date;

    gender: string;

    phone: string;

    address: string;

    cityId: number;

    favoriteComplexId: number;

}

