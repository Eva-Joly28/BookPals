import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { Inject, Service } from "typedi";
import { CommentRepository } from "../repositories/comment.repository";
import { CommentService } from "../../core/services/CommentService";
import { CommentControllerPort } from "src/core/ports/in/CommentControllerPort";
import { Comment } from "../../database/entities/Comment";
import { commentPost, commentPatch } from "../validators/Comment";
import { RequiredEntityData } from "@mikro-orm/core";
import JsonApiSerializer from "../../utils/jsonapi-serializer";
import { validateOrReject } from "class-validator";
import JsonApiDeserializer from "../../utils/deserializer";

@JsonController('/comments')
@Service()
export class CommentController implements CommentControllerPort {
  constructor(
    @Inject('commentRepo') private readonly commentRepository: CommentRepository,
    @Inject('commentService') private commentService : CommentService, 
) {
    this.commentService = new CommentService(commentRepository)
  }
    @Get('/',{transformResponse:false})
    async getWithFilters(@Req() request: any): Promise<any> {
       const {filters} = request.params();
       let results = await this.commentService.getCommentsWithFilters(filters);
       return JsonApiSerializer.serializeComments(results);
    }

    @Post('/',{transformResponse:false})
    async create(@Body() comment: any): Promise<any> {
        let deserializedComment = JsonApiDeserializer.deserializeComment(comment);await validateOrReject(Object.assign(new commentPost(),deserializedComment))
        return this.commentService.createComment(deserializedComment as RequiredEntityData<Comment>)
    }

    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id: string) {
        let result = await this.commentService.getComment(id);
        return result!=null ? JsonApiSerializer.serializeComment(result) : undefined; 
    }

    @Patch('/:id',{transformResponse:false})
    async update(@Param('id') id: string, @Body() comment: commentPatch){
        let deserializedComment = JsonApiDeserializer.deserializeComment(comment);
        await validateOrReject(Object.assign(new commentPatch(),deserializedComment))
        let result = await this.commentService.updateComment(id, comment);
        return result!== null ? JsonApiSerializer.serializeComment(result) : undefined;
    }

    @Delete('/:id', {transformResponse:false})
    delete(@Param('id') id: string): Promise<void> {
        return this.commentService.deleteComment(id);
    }

}