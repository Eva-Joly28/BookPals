import { EntityManager, EntityRepository, RequiredEntityData, SelectQueryBuilder, wrap } from "@mikro-orm/postgresql";
import { ListRepositoryPort } from "src/core/ports/out/listRepositoryPort";
import { List } from "../../database/entities/List";
import { Service } from "typedi";

export interface listFilters{
    book?:string,
    creator?: string,
    likedBy?:string,
    orderByLikes?: boolean,
    orderByDate: boolean,
    offset?:number,
    limit?: number,
}

@Service('listRepo')
export class ListRepository extends EntityRepository<List> implements ListRepositoryPort{
    constructor(em:EntityManager){
        super(em, List);
    }

    getListsWithFilters(filters: any): Promise<List[]> {
        const qb = this.em.qb(List,'l').select('*')
        .leftJoinAndSelect('l.books','b')
        .leftJoinAndSelect('l.likedBy','u');
        
        if(filters){
            this.setupFilters(filters, qb);

            if(filters.offset){
                qb.offset(parseInt(filters.offset))
            }

            if(filters.limit){
                qb.limit(parseInt(filters.limit));
            }
        }
        return qb.execute("all");
    }
    async getList(id: string): Promise<List | null> {
    return await this.findOne({id},{populate:['*']});
    }
    async createList(list: RequiredEntityData<List>): Promise<List | undefined> {
        let existingList = await this.findOne({name:list.name, creator:list.creator});
        if(existingList!==null){
            throw new Error('une liste de cet utilisateur porte déjà ce nom');
            // return existingList; peut-être en jsonApi
        }
        const newList = new List();
        wrap(newList).assign(list,{em:this.em});
        await this.em.persistAndFlush(newList);
        return newList;

    }
    async updateList(id: string, list: Partial<List>): Promise<List | null> {
        const result = await this.findOne({id},{populate:['*']});
        if(!result || result===null){
            return null;
        }
        wrap(result!).assign(list);
        console.log(result);
        await this.em.persistAndFlush(result!);
        return result;
    }
    async deleteList(id: string): Promise<void> {
        const result = await this.findOne({id},{populate:['*']});
            if(result && result!== null){
                await this.em.removeAndFlush(result!);
            }
    }
    

    filterBook(filters: listFilters, qb:SelectQueryBuilder<List>){
        if(filters.book){
            qb.where({ 'b.id': filters.book })
        }
    }

    filterCreator(filters: listFilters, qb:SelectQueryBuilder<List>){
        if(filters.creator){
            qb.where({creator:filters.creator})
        }
    }

    filterOrderByDate(filters: listFilters, qb:SelectQueryBuilder<List>){
        if(filters.orderByDate){
            qb.orderBy({createdAt: 'DESC'});
        }
    }

    filterOrderByLikes(filters: listFilters, qb:SelectQueryBuilder<List>){
        if(filters.orderByLikes){
            qb.select(['l.*', 'COUNT(lb.id) AS likeCount'])
            .leftJoin('l.likedBy', 'lb')
            .groupBy('l.id')
            .orderBy({ likeCount: 'desc' })
        }
    }

    setupFilters(filters:listFilters, qb:SelectQueryBuilder<List>){
        this.filterBook(filters,qb);
        this.filterCreator(filters,qb);
        this.filterOrderByLikes(filters,qb);
        this.filterOrderByDate(filters,qb);
    }


}