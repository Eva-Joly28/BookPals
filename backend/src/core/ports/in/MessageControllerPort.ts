import { Message } from "src/database/entities/Message";

export interface MessageControllerPort{
    getWithFilters(params : any) : Promise<Message[]>;
    create(list : any) : Promise<any>;
    getOne(id: string):Promise<any>;
    update(id:string,list: any): Promise<any>;
    delete(id:string): Promise<void>;
}