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
        let like = this.findOne({id});
        return like!==null? like : undefined;
    }

    async createOne(like : RequiredEntityData<CommentLike>){
        try{
            let existingLike = await this.findOne({comment:like.comment, user:like.user})
            if(existingLike!==null){
                return existingLike;
            }
            console.log(like);
            const newLike = new CommentLike();
            wrap(newLike).assign(like,{em:this.em});
            await this.em.persistAndFlush(newLike);
            const comment = await this.em.findOne(Comment, like.comment, {populate:['*']});
            const user = await this.em.findOne(User, like.user, { populate: ['*'] });
            if(comment!==null && !comment.likedBy.find((like)=>like.id===newLike.id)){
                comment.likedBy = [...comment.likedBy, newLike];
                wrap(comment).assign({
                    likedBy: comment.likedBy
                });
                await this.em.refresh(comment);
                await this.em.persistAndFlush(newLike.comment);

            }
            if(user!==null && !user.likedComments.find((like)=>like.id===newLike.id)){
                user.likedComments = [...user.likedComments, newLike]
                wrap(user).assign({
                    likedComments: user.likedComments
                });
                await this.em.refresh(user);
                await this.em.persistAndFlush(newLike.user);
            }
            return newLike;
        }
        catch(e){
            return undefined;
        }
    }

    async deleteOne(id: string){
        try{
            const result = await this.findOne({id},{populate:['*']});
            // console.log(result);
            if(result && result!== null){
                console.log("id du commentaire : ",result.comment.id);
                const comment = await this.em.findOne(Comment, result.comment.id, {populate:['*']});
                const user = await this.em.findOne(User, result.user.id, { populate: ['*'] });
                await this.em.removeAndFlush(result!);

                if(user!==null){
                    wrap(user).assign({
                        likedComments: user.likedComments.filter((like)=> like.id!==id)
                    });
                    await this.em.persistAndFlush(user);
                    await this.em.refresh(user);
                }
                if(comment!==null){
                    wrap(comment).assign({
                        likedBy: comment.likedBy.filter((like)=> like.id!==id)
                    });
                    await this.em.persistAndFlush(comment);
                    await this.em.refresh(comment);

                }

            }
        }
        catch(e){
            console.log("il y a une erreur : ",e);
            throw new NotFoundError();
        }
    }


}