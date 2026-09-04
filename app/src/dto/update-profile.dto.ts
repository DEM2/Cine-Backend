// app/src/dto/update-profile.dto.ts

export interface UpdateProfileDto {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    photo_url?: string;
    email?: string;
    notification_preferences?: {
        transactionalEmail: boolean;
        promotionalEmail: boolean;
        sms: boolean;
        push: boolean;
    };
}