/**
 * Criterios de consulta para el repositorio de películas.
 * El service traduce DTOs de la API a estos tipos antes de persistir/consultar.
 */

export interface MovieFilterCriteria {
    movie: {
        title?: string;
        genre?: string;
        rating?: string;
        language?: string;
        premiere?: boolean;
    };
    showtime: {
        date?: string;
        formatId?: number;
        complex?: string;
        isSoldOut?: boolean;
    };
}

export interface ShowtimeSearchCriteria {
    movieId: number;
    isActive: boolean;
    onlyWithAvailableSeats: boolean;
    startTimeGt?: Date;
    startTimeLt?: Date;
    startTimeGte?: Date;
    roomId?: number;
    roomIds?: number[];
    formatId?: number;
    language?: string;
    isSubtitled?: boolean;
}
