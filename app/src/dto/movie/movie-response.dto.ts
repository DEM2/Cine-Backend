/**
 * DTO utilizado para mostrar la cartelera.
 *
 * @example
 * const movie = {
 *   id: "7f1c3d2e-5a67-4fbb-91cb-02a8e31b2b9d",
 *   title: "Inception",
 *   poster: "https://...",
 *   genres: ["Acción", "Ciencia ficción"],
 *   classification: "PG-13",
 *   duration: 148,
 *   director: "Christopher Nolan",
 *   language: "Español",
 *   subtitles: true,
 *   formats: ["2D", "3D,","IMAX","VIP"],
 *   showtimes: ["13:00", "16:10", "20:30"],
 *   isPremiere: true,
 *   publicRating: 8.8
 * };
 */
export interface MovieCardDto {

  id: string;

  poster: string;

  title: string;

  synopsis: string;

  genres: string[];

  classification: string;

  duration: number;

  director: string;

  language: string;

  subtitles: boolean;

  formats: string[];

  showtimes: string[];

  isPremiere: boolean;

  publicRating: number;
  
  banner_url?: string;
  trailer_url?: string;
  release_date?: string;
  is_release?: boolean;
  status?: string;
}