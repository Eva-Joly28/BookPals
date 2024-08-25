import { RequiredEntityData } from "@mikro-orm/core";
import { List } from "src/database/entities/List";

export interface ListRepositoryPort {
    getListsWithFilters(query: any): Promise<List[]>;
    getList(id: string): Promise<List | null>;
    createList(list:RequiredEntityData<List>): Promise<List | undefined>;
    updateList(id:string,book:Partial<List>):Promise<List | null>;
    deleteList(id:string):Promise<void>;
}