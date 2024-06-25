import { EntityManager, EntityRepository,RequiredEntityData,SelectQueryBuilder,wrap } from "@mikro-orm/postgresql";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { CommentRepositoryPort } from "src/core/ports/out/commentRepositoryPort";
import { Rating } from "../../database/entities/Rating";
import { RatingRepositoryPort } from "src/core/ports/out/ratingRepositoryPort";

export interface RatingFilters{
    book?:string,
    user?: string,
    likedBy?:string,
    orderByDate: boolean,
    offset?:number,
    limit?: number,
}

@Service('ratingRepo')
export class RatingRepository extends EntityRepository<Rating> implements RatingRepositoryPort {
    constructor(em:EntityManager){
        super(em,Rating);
    }

    getRatingsWithFilters(filters: any): Promise<Rating[]> {
        const qb = this.em.qb(Rating,'r').select('*')
        .leftJoinAndSelect('r.book','b')
        .leftJoinAndSelect('r.user','u');
        
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

    getRating(id: string): Promise<Rating | null> {
        return this.findOne({id},{populate:['*']});
    }
    async createRating(rating: RequiredEntityData<Rating>): Promise<Rating | undefined> {
        const newRating = new Rating();
        wrap(newRating).assign(rating,{em:this.em});
        await this.em.persistAndFlush(newRating);
        return newRating;
    }
    async updateRating(id: string, rating: Partial<Rating>): Promise<Rating | null> {
        const result = await this.findOne({id}, {populate:['*'] });
        if(!result || result === null){
            return null;
        }
        wrap(result!).assign(rating,{em:this.em});
        await this.em.persistAndFlush(result!);
        return result;

    }
    async deleteRating(id: string): Promise<void> {
        try{
            const result = await this.findOne({id});
            if(result && result!== null){
                await this.em.removeAndFlush(result!);
                wrap(result.user).assign({
                    ratings: result.user.ratings.filter((rate)=> rate.id===id)
                });
                await this.em.persistAndFlush(result.user);
                wrap(result.book).assign({
                    ratings: result.book.ratings.filter((rate)=> rate.id===id)
                });
                await this.em.persistAndFlush(result.book);
            }
        }
        catch(e){
            throw new NotFoundError();
        }
    }

    filterBook(filters: RatingFilters, qb:SelectQueryBuilder<Rating>){
        if(filters.book){
            qb.where({book:filters.book})
        }
    }

    filterUser(filters: RatingFilters, qb:SelectQueryBuilder<Rating>){
        if(filters.user){
            qb.where({user:filters.user})
        }
    }

    filterOrderByDate(filters: RatingFilters, qb:SelectQueryBuilder<Rating>){
        if(filters.orderByDate){
            qb.orderBy({updatedAt: 'DESC'});
        }
    }

    setupFilters(filters:RatingFilters, qb:SelectQueryBuilder<Rating>){
        this.filterBook(filters,qb);
        this.filterUser(filters,qb);
        this.filterOrderByDate(filters,qb);
    }

}