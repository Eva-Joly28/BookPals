import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { Inject, Service } from "typedi";
import { CommentRepository } from "../repositories/comment.repository";
import { CommentService } from "../../core/services/CommentService";
import { CommentControllerPort } from "src/core/ports/in/CommentControllerPort";
import { Comment } from "../../database/entities/Comment";
import { commentPost, commentPatch } from "../validators/Comment";
import { RequiredEntityData } from "@mikro-orm/core";

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
    getWithFilters(@Req() request: any): Promise<Comment[]> {
       const {filters} = request.params();
       return this.commentService.getCommentsWithFilters(filters);
    }

    @Post('/',{transformResponse:false})
    create(@Body() comment: commentPost): Promise<any> {
        return this.commentService.createComment(comment as RequiredEntityData<Comment>)
    }

    @Get('/:id',{transformResponse:false})
    getOne(@Param('id') id: string) {
        return this.commentService.getComment(id);
    }

    @Patch('/:id',{transformResponse:false})
    update(@Param('id') id: string, @Body() comment: commentPatch){
        return this.commentService.updateComment(id, comment);
    }

    @Delete('/:id', {transformResponse:false})
    delete(@Param('id') id: string): Promise<void> {
        return this.commentService.deleteComment(id);
    }

}