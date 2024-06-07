import { User } from "src/database/entities/User";

export interface UserControllerPort {
    getMany(params : string): Promise<User[]>;
    getOne(id: string) : Promise<User| null>;
    create(book: any) : Promise<User|undefined>;
    update(id:string,book: any): Promise<User|null>
    delete(user: any):void;
}