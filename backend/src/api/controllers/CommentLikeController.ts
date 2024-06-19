import { EntityRepository, RequiredEntityData, SqlEntityRepository, wrap } from "@mikro-orm/postgresql";
import { Body, Delete, Get, JsonController, NotFoundError, Param, Post, Req } from "routing-controllers";
import { AppService } from "../../core/services/AppService";
import { CommentLike } from "../../database/entities/CommentLike";
import { Inject, Service } from "typedi";
import { CommentLikeRepository } from "../repositories/comment-like.repository";

@JsonController('/comment-likes')
@Service()
export class CommentLikeController {
    constructor(@Inject('commentLikeRepo') private readonly repository: CommentLikeRepository,){}

    @Get('/',{transformResponse:false})
    async getMany(@Req() query:any){
        const {filters} = query.params;
        return await this.repository.getManyWithFilters(filters);
    }

    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id:string) {
        return await this.repository.getOne(id);
    }

    @Post('/',{transformResponse:false})
    async create(@Body() body: RequiredEntityData<CommentLike>){
        return await this.repository.createOne(body);
    }

    @Delete('/:id')
    async delete(@Param('id') id:string){
        await this.repository.deleteOne(id);
    }

}