import { UserPost, UserPatch } from "src/api/validators/User";
import { User } from "src/database/entities/User";

export interface UserRepositoryPort {
    findAll(): Promise<User[]>;
    findByEmail(email:string): Promise<User|null>;
    findById(id: string):Promise<User|null>;
    createUser(user: UserPost): Promise<User>
    deleteUser(id:string):Promise<User>;
    updateUser(id:string, user: UserPatch): Promise<User>;
}