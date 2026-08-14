// app/src/dto/movi/create-movie.dto.ts

/**
 * DTO - Creación de peliculas
 * -------------------------
 * Este DTO representa la información necesaria para crear un nuevo peliculas.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de peliculass.
 *
 * @property {string} title - Nombre completo de las peliculas.
 * @property {string} original_title - Nombre original de la peliculas.
 * @property {string} synopsis -  descripción de la peliculas.
 * @property {string} director -  el director de la peliculas.
 * @property {number} duration_minutes -  duracion de la pelicula
 * @property {number[]} genres - Géneros de la película.
 * @property {string} rating - Clasificación (A, B, B15, C, etc.).
 * @property {string} language - Idioma original.
 * @property {boolean} dubbed - Indica si está disponible doblada.
 * @property {boolean} subtitled - Indica si está disponible subtitulada.
 * @property {string} poster - URL del póster oficial.
 * @property {boolean} premiere - Indica si es un estreno.
 * @property {number} audience_rating - Calificación del público (0-10 o 0-5).
 * @property {string[]} formats - Formatos disponibles (2D, 3D, IMAX, VIP).
 * @property {Funcion[]} showtimes - Horarios disponibles.
 * 
 *  
* Ejemplo:
 *
 * const dto: CreateMovieDto = {
 *   title: "Avatar: El camino del agua",
 *   original_title: "Avatar: The Way of Water",
 *   synopsis: "Una nueva aventura en el planeta Pandora.",
 *   director: "James Cameron",
 *   duration_minutes: 192,
 *   genre: "Ciencia ficción",
 *   rating: "B",
 *   language: "Inglés",
 *   dubbed: true,
 *   subtitled: true,
 *   poster: "avatar.jpg",
 *   premiere: false,
 *   audience_rating: 4.8,
 *   formats: ["2D", "3D", "IMAX"]
 * };
 */

export interface CreateMovieDto {


    title: string;


    original_title: string;

    synopsis: string;

    director: string;

        /**
     * Duración de la película en minutos.
     */
    duration_minutes: number;

    /**
     * Género de la película.
     */
    genres: number[];

    /**
     * Clasificación de la película (A, B, B15, C, etc.).
     */
    rating: string;

    /**
     * Idioma original de la película.
     */
    language: string;

    /**
     * Indica si la película tiene disponibilidad en versión doblada.
     */
    dubbed: boolean;

    /**
     * Indica si la película tiene disponibilidad en versión subtitulada.
     */
    subtitled: boolean;

    /**
     * URL o ruta del póster oficial de la película.
     */
    poster: string;

    /**
     * Indica si la película es un estreno.
     */
    premiere: boolean;

    /**
     * Calificación promedio otorgada por el público.
     */
    audience_rating: number;

}