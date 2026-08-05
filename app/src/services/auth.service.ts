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
        const validatePassword = await bcrypt.compare(password, user.password);

        if(!validatePassword){
            throw new AppError(401,"credenciales invalidas")
        };
        
        return user
    }
}

export default new AuthService