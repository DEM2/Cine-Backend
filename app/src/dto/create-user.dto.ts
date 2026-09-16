// app/src/dto/create-user.dto.ts

/**
 * DTO - Creación de Usuario
 * -------------------------
 * Este DTO representa la información necesaria para crear un nuevo usuario.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * Se utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 *
 * Nota: El campo `role_id` NO forma parte de este DTO. El rol se asigna
 * automáticamente en la capa de servicio: todo usuario registrado a través
 * de este endpoint recibe por defecto el rol "Natural".
 */

/**
 * Objeto de transferencia de datos para la creación de usuarios.
 *
 * @property {string} email - Dirección de correo electrónico única del usuario.
 * @property {string} password - Contraseña del usuario (se encripta antes de persistir).
 * @property {number} document_type_id - Identificador del tipo de documento (FK -> document_types).
 * @property {string} document_number - Número de documento de identidad, único.
 * @property {string} first_name - Nombres del usuario.
 * @property {string} last_name - Apellidos del usuario.
 * @property {string} birth_date - Fecha de nacimiento (formato "YYYY-MM-DD").
 * @property {string} gender - Género del usuario. (opcional)
 * @property {string} phone - Teléfono de contacto del usuario.
 * @property {string} address - Dirección de residencia del usuario.
 * @property {number} city_id - Identificador de la ciudad de residencia (FK -> cities).
 * 
 *
 * @example
 * const dto: CreateUserDto = {
 *   email: "daniel@gmail.com",
 *   password: "123456",
 *   document_type_id: 1,
 *   document_number: "1045678901",
 *   first_name: "Daniel",
 *   last_name: "Mendoza",
 *   birth_date: "2002-05-15",
 *   gender: "Masculino",
 *   phone: "3001234567",
 *   address: "Calle 123",
 *   city_id: 5
 * };
 */
export interface CreateUserDto {

    /**
     * Correo electrónico del usuario.
     */
    email: string;

    // confirmacion de correo electrónico del usuario.
    email_confirmation: string;

    /**
     * Contraseña del usuario.
     */
    password: string;

    // confirmacion de contraseña del usuario.
    password_confirmation: string;

    /**
     * Identificador del tipo de documento de identidad.
     */
    document_type_id: number;

    /**
     * Número de documento de identidad.
     */
    document_number: string;

    /**
     * Nombres del usuario.
     */
    first_name: string;

    /**
     * Apellidos del usuario.
     */
    last_name: string;

    /**
     * Fecha de nacimiento del usuario.
     */
    birth_date: string;

    /**
     * Género del usuario.
     * ? : opcional
     */
    gender?: string;

    /**
     * Teléfono de contacto del usuario.
     */
    phone: string;

    /**
     * Dirección de residencia del usuario.
     */
    address: string;

    /**
     * Identificador de la ciudad de residencia del usuario.
     */
    city_id: number;

    // complejo favorito 
    favorite_complex_id?: number | null;

    // tratamiento de datos del usuario
    data_processing_consent: boolean;

    // termino y condiciones del usuario
    terms_and_conditions: boolean;

    // comunicaciones comerciales
    commercial_communications?: boolean;

    // token generado por Cloudflare Turnstile
    captchaToken: string;
}