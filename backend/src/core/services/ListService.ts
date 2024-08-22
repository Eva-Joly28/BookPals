import { Service } from "typedi";
import { ListRepositoryPort } from "../ports/out/listRepositoryPort";
import { List } from "../../database/entities/List";
import { RequiredEntityData } from "@mikro-orm/core";

@Service('listService')
export class ListService {
    constructor(private readonly listRepository: ListRepositoryPort){}

    async getListsWithFilters(query : any) : Promise<List[]>{
        return await this.listRepository.getListsWithFilters(query);
    }

    async getList(listId: string){
        return await this.listRepository.getList(listId);
    }

    async createList(list:RequiredEntityData<List>) : Promise<List|undefined>{
        return await this.listRepository.createList(list);
    }

    async updateList(id:string, book:Partial<List>): Promise<List | null>{
        return await this.listRepository.updateList(id,book)
    } 

    async deleteList(id:string){
        await this.listRepository.deleteList(id);
    }

}