import { EntityManager, EntityRepository,RequiredEntityData,SelectQueryBuilder,wrap } from "@mikro-orm/postgresql";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { CommentRepositoryPort } from "src/core/ports/out/commentRepositoryPort";
import { Comment } from "../../database/entities/Comment";

export interface commentFilters{
    book?:string,
    user?: string,
    likedBy?:string,
    orderByLikes?: boolean,
    orderByLikedAt?: boolean,
    orderByDate: boolean,
    offset?:number,
    limit?: number,
}

@Service('commentRepo')
export class CommentRepository extends EntityRepository<Comment> implements CommentRepositoryPort {
    constructor(em:EntityManager){
        super(em,Comment);
    }


    getCommentsWithFilters(filters: any): Promise<Comment[]> {
        const qb = this.em.qb(Comment,'c').select('*')
        .leftJoinAndSelect('c.likedBy','cl')
        .leftJoinAndSelect('cl.user','u')
        .leftJoinAndSelect('c.book','b');

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
    async getComment(id: string): Promise<Comment | null> {
        return await this.findOneOrFail({id},{populate:['*']});
    }
    async createComment(comment: RequiredEntityData<Comment>): Promise<Comment> {
        const newComment = new Comment();
        wrap(newComment).assign(comment,{em:this.em});
        await this.em.persistAndFlush(newComment);
        return newComment;
    }
    async deleteComment(id: string): Promise<void> {
        try{
            const result = await this.findOne({id});
            if(result && result!== null){
                await this.em.removeAndFlush(result!);
                wrap(result.user).assign({
                    comments: result.user.comments.filter((comment)=> comment.id===id)
                });
                await this.em.persistAndFlush(result.user);
                wrap(result.book).assign({
                    comments: result.book.comments.filter((comment)=> comment.id===id)
                });
                await this.em.persistAndFlush(result.book);
            }
        }
        catch(e){
            throw new NotFoundError();
        }
    }
    async updateComment(id: string, comment: Partial<Comment>): Promise<Comment> {
        const result = await this.findOneOrFail({id}, {failHandler: () => new NotFoundError(),  populate:['*'] });
        wrap(result).assign(comment, {em:this.em});
        await this.em.persistAndFlush(result);
        return result;
    }

    filterBook(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.book){
            qb.where({book:filters.book})
        }
    }

    filterUser(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.user){
            qb.where({user:filters.user})
        }
    }

    filterLikedBy(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.likedBy){
            qb.where({likedBy:{user:filters.likedBy}});
        }
    }

    filterOrderByLikes(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.orderByLikes){
            qb.select([
                'c.*',
                'COUNT(cl.id) as likeCount'
            ])
            .groupBy('c.id')
            .orderBy({likeCount: 'DESC'});
        }
    }

    filterOrderByLikedAt(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.orderByLikedAt){
            qb.orderBy({'cl.likedAt':'DESC'});
        }
    }

    filterOrderByDate(filters: commentFilters, qb:SelectQueryBuilder<Comment>){
        if(filters.orderByDate){
            qb.orderBy({updatedAt: 'DESC'});
        }
    }

    setupFilters(filters:commentFilters, qb:SelectQueryBuilder<Comment>){
        this.filterBook(filters,qb);
        this.filterUser(filters,qb);
        this.filterLikedBy(filters,qb);
        this.filterOrderByLikes(filters,qb);
        this.filterOrderByLikedAt(filters,qb);
        this.filterOrderByDate(filters,qb);
    }
}