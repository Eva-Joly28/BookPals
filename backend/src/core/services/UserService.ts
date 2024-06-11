import { Service } from "typedi";
import { UserRepositoryPort } from "../ports/out/userRepositoryPort";
import { User } from "src/database/entities/User";
import { UserPatch, UserPost } from "src/api/validators/User";

@Service('userService')
export class UserService {
    constructor(
        private readonly userRepository:UserRepositoryPort
    ){}

    async getUsersWithFilters(query: any): Promise<User[]>{
        return await this.userRepository.findWithFilters(query);
    }

    async getUser(id: string){
        return await this.userRepository.findById(id);
    }

    async createUser(user: UserPost){
        return await this.userRepository.createUser(user);
    }

    async updateUser(id:string, user: UserPatch){
        return await this.userRepository.updateUser(id,user);
    }


}