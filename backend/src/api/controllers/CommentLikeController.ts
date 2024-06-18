import { EntityRepository, RequiredEntityData, SqlEntityRepository, wrap } from "@mikro-orm/postgresql";
import { Body, Delete, Get, JsonController, NotFoundError, Param, Post, Req } from "routing-controllers";
import { AppService } from "../../core/services/AppService";
import { CommentLike } from "../../database/entities/CommentLike";
import { Service } from "typedi";

@JsonController('/comment-likes')
@Service()
export class CommentLikeController {
    constructor(public repository : EntityRepository<CommentLike>){
        this.repository = new AppService().getEntityManager().getRepository<CommentLike>('CommentLike') as EntityRepository<CommentLike>;
    }

    @Get('/',{transformResponse:false})
    async getMany(@Req() query:any){
        const {filters} = query.params();
        let qb = this.repository.createQueryBuilder('CommentLike').select('*');
        if(filters.user){
            return await qb.where({user:filters.user}).orderBy({likedAt:'DESC'}).execute('all');
        }
        if(filters.comment){
            return await qb.where({comment:filters.comment}).orderBy({likedAt:'DESC'}).execute('all');
        }

        return await qb.orderBy({likedAt: 'DESC'}).limit(50);
    }

    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id:string) {
        let like = this.repository.findOne({id});
        return like!==null? like : undefined;
    }

    @Post('/',{transformResponse:false})
    async create(@Body() body: RequiredEntityData<CommentLike>){
        try{
            let like = new CommentLike();
            wrap(like).assign(body,{em:this.repository.getEntityManager()});
            await this.repository.getEntityManager().persistAndFlush(like);
            return like;
        }
        catch(e){
            return undefined;
        }
    }

    @Delete('/')
    async delete(@Param('id') id:string){
        let result = this.repository.findOne({id});
        result !== null ? await this.repository.getEntityManager().removeAndFlush(result) : new NotFoundError();
    }

}