import AppError from "../error/appError";

/**
 * Servicio encargado de validar el CAPTCHA de Cloudflare Turnstile.
 *
 * El frontend obtiene un token de Turnstile y lo envía al backend.
 * Este servicio envía ese token a Cloudflare para comprobar que
 * la validación fue correcta.
 */

// datos de prueba; TURNSTILE_SECRET_KEY: 1x0000000000000000000000000000000AA ; Site Key: XXXX.DUMMY.TOKEN.XXXX
class CaptchaService {

    /**
     * Verifica un token de Cloudflare Turnstile.
     *
     * @param token Token generado por Turnstile en el frontend.
     * @returns true si el token es válido.
     */
    async verify(token: string): Promise<boolean> {

        // Verificamos que el frontend realmente haya enviado el token.
        if (!token) {
            throw new AppError(
                400,
                "La validación CAPTCHA es obligatoria"
            );
        }

        // Obtenemos la clave secreta desde las variables de entorno.
        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        // Si no existe la clave, el backend no puede comunicarse
        // correctamente con Cloudflare.
        if (!secretKey) {
            throw new AppError(
                500,
                "No está configurada la clave secreta de Turnstile"
            );
        }

        // Enviamos el token a Cloudflare para su validación.
        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                // una peticion post porque necesitamos enviar informacion a cloudflare
                method: "POST",
                // la informacion que se esta enviando viene en formato de form
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, 
                // URLSearchParams convierte el objeto a algo parecido a secret=ABC123&response=XYZ456
                body: new URLSearchParams({
                    secret: secretKey,
                    // token generado por turnstile
                    response: token
                })
            }
        );

        // Convertimos la respuesta de Cloudflare a JSON.
        const result = await response.json();

        // Si Cloudflare indica que el token no es válido,
        // rechazamos el registro.
        if (!result.success) {
            throw new AppError(
                400,
                "La validación CAPTCHA no fue exitosa"
            );
        }

        return true;
    }
}

export default new CaptchaService();