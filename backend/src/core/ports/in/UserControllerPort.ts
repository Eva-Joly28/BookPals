import { User } from "src/database/entities/User";

export interface UserControllerPort {
    getWithFilters(params : any): Promise<User[]>;
    getOne(id: string) : Promise<User| null>;
    update(id:string,book: any): Promise<User|null>
}