import { EntityManager, EntityRepository, RequiredEntityData, wrap } from "@mikro-orm/postgresql";
import { CommentLike } from "../../database/entities/CommentLike";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { commentPatch } from "../validators/Comment";

@Service('commentLikeRepo')
export class CommentLikeRepository extends EntityRepository<CommentLike> {
    constructor(em:EntityManager){
        super(em,CommentLike);
    }

    async getManyWithFilters(filters:any){
        let qb = this.em.qb('CommentLike').select('*');
        console.log(filters);
        if(filters.user){
            return await qb.where({user:filters.user}).orderBy({likedAt:'DESC'}).execute('all');
        }
        if(filters.comment){
            return await qb.where({comment:filters.comment}).orderBy({likedAt:'DESC'}).execute('all');
        }

        return await qb.orderBy({likedAt: 'DESC'}).limit(50);
    }

    async getOne(id:string){
        let like = this.findOne({id});
        return like!==null? like : undefined;
    }

    async createOne(like : RequiredEntityData<CommentLike>){
        try{
            const newLike = new CommentLike();
            wrap(newLike).assign(like,{em:this.em});
            await this.em.persistAndFlush(newLike);
            return newLike;
        }
        catch(e){
            return undefined;
        }
    }

    async deleteOne(id: string){
        try{
            const result = await this.findOne({id},{populate:['*']});
            console.log(result);
            if(result && result!== null){
                await this.em.removeAndFlush(result!);
                wrap(result.user).assign({
                    likedComments: result.user.likedComments.filter((like)=> like.id!==id)
                });
                await this.em.persistAndFlush(result.user);
                wrap(result.comment).assign({
                    likedBy: result.comment.likedBy.filter((like)=> like.id!==id)
                });
                await this.em.persistAndFlush(result.comment);

            }
        }
        catch(e){
            console.log(e);
            throw new NotFoundError();
        }
    }


}