import AppError from "../error/appError";
import User from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { IAuthService } from "./interfaces/auth.service.interface";
import bcrypt from "bcrypt";



class AuthService implements IAuthService {
    
     async login(email: string, password: string): Promise<User | null> {
        const user = await userRepository.findByEmail(email);
        if (!user){
            throw new AppError(401,"credenciales invalidas")
        };

        // verifica si el usuario esta bloqueado 
        // lockoutUntil contiene la fecha y hora hasta la que esta bloqueado 
        if (user.lockoutUntil) {
            // obtiene la fecha y hora actual
            const now = new Date();

            // Si todavía no ha pasado la fecha de bloqueo
            if (now < user.lockoutUntil) {
                throw new AppError(
                    429,
                    "Demasiados intentos fallidos. Intenta nuevamente más tarde."
                );
            }

            // Si el bloqueo ya terminó, reiniciamos los datos
            user.failedLoginAttempts = 0;
            user.lockoutUntil = null;

            await user.save();
        }

        // valida contraseña
        // compara la contraseña que escribio el usuario con la cifrada ya almacenada
        const validatePassword = await bcrypt.compare(password, user.password);

        // contraseña incorrecta
        if(!validatePassword){
            user.failedLoginAttempts += 1;

        // Si llega a 5 intentos fallidos
        if (user.failedLoginAttempts >= 5) {

            // toma la hora actual
            const lockoutTime = new Date();

            // Bloqueo de 15 minutos
            lockoutTime.setMinutes(
                lockoutTime.getMinutes() + 15
            );

            user.lockoutUntil = lockoutTime;
        }

        await user.save();

        throw new AppError(401, "credenciales invalidas");
        };

        // si la contraseña es correcta reinicia todo
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;

        await user.save();
        
        return user
    }
}

export default new AuthService