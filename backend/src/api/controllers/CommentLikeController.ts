import { EntityRepository, RequiredEntityData, SqlEntityRepository, wrap } from "@mikro-orm/postgresql";
import { Body, Delete, Get, JsonController, NotFoundError, Param, Post, Req } from "routing-controllers";
import { AppService } from "../../core/services/AppService";
import { CommentLike } from "../../database/entities/CommentLike";
import { Inject, Service } from "typedi";
import { CommentLikeRepository } from "../repositories/comment-like.repository";
import JsonApiDeserializer from "../../utils/deserializer";
import JsonApiSerializer from "../../utils/jsonapi-serializer";

@JsonController('/comment-likes')
@Service()
export class CommentLikeController {
    constructor(@Inject('commentLikeRepo') private readonly repository: CommentLikeRepository,){}

    @Get('/',{transformResponse:false})
    async getMany(@Req() query:any){
        const {filters} = query.params;
        return JsonApiSerializer.serializeCommentLikes(await this.repository.getManyWithFilters(filters) as CommentLike[]);
    }

    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id:string) {
        let result = await this.repository.getOne(id);
        return result!== null ? JsonApiSerializer.serializeCommentLike(result as CommentLike) : undefined;
    }

    @Post('/',{transformResponse:false})
    async create(@Body() body: RequiredEntityData<CommentLike>){
        let like = JsonApiDeserializer.deserializeCommentLike(body);
        let result = await this.repository.createOne(like);
        return result ? JsonApiSerializer.serializeCommentLike(result) : undefined;
    }

    @Delete('/:id')
    async delete(@Param('id') id:string){
        await this.repository.deleteOne(id);
    }

}