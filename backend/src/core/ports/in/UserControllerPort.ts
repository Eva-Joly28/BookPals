import { User } from "src/database/entities/User";

export interface UserControllerPort {
    getWithFilters(params : any) : Promise<any>;
    getOne(id: string):Promise<any>;
    update(id:string,book: any): Promise<any>;
}