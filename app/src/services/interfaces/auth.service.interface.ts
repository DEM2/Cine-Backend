import User from "../../models/user.model";

export interface IAuthService {
    login (email:string, password:string): Promise<User|null>;
   
}