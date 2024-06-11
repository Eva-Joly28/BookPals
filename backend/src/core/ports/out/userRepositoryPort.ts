import { UserFilters } from "src/api/repositories/user.repository";
import { UserPost, UserPatch } from "src/api/validators/User";
import { User } from "src/database/entities/User";

export interface UserRepositoryPort {
    findWithFilters(filters:any): Promise<User[]>;
    findById(id: string):Promise<User|null>;
    createUser(user: UserPost): Promise<User>
    deleteUser(id:string):Promise<void>;
    updateUser(id:string, user: UserPatch): Promise<User>;
}