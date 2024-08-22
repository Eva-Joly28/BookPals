import { List } from "src/database/entities/List";

export interface ListControllerPort{
    getWithFilters(params : any) : Promise<List[]>;
    create(list : any) : Promise<any>;
    getOne(id: string):Promise<any>;
    update(id:string,list: any): Promise<any>;
    delete(id:string): Promise<void>;
}