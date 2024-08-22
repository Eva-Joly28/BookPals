import { EntityManager, EntityRepository, RequiredEntityData, wrap } from "@mikro-orm/postgresql";
import { CommentLike } from "../../database/entities/CommentLike";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { commentPatch } from "../validators/Comment";
import { User } from "../../database/entities/User";
import { Comment } from "../../database/entities/Comment";

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
        let like = this.findOne({id},{refresh:true});
        return like!==null? like : undefined;
    }

    async createOne(like : RequiredEntityData<CommentLike>){
        try{
            let existingLike = await this.findOne({comment:like.comment, user:like.user})
            if(existingLike!==null){
                return existingLike;
            }
            const newLike = new CommentLike();
            wrap(newLike).assign(like,{em:this.em});
            await this.em.persistAndFlush(newLike);
            const comment = await this.em.findOne(Comment, like.comment, {populate:['*'], refresh:true});
            const user = await this.em.findOne(User, like.user, { populate: ['*'], refresh:true});
            
            return newLike;
        }
        catch(e){
            return undefined;
        }
    }

    async deleteOne(id: string){
        try{
            const result = await this.findOne({id},{populate:['*']});
            if(result && result!== null){
                const comment = await this.em.findOne(Comment, result.comment, {populate:['*'], refresh:true});
                const user = await this.em.findOne(User, result.user, { populate: ['*'], refresh:true});
                await this.em.removeAndFlush(result!);
            }
        }
        catch(e){
            console.log("il y a une erreur : ",e);
            throw new NotFoundError();
        }
    }


}