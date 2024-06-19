import { Service } from "typedi";
import { Comment } from "src/database/entities/Comment";
import { RequiredEntityData } from "@mikro-orm/core";
import { CommentRepositoryPort } from "../ports/out/commentRepositoryPort";

@Service('commentService')
export class CommentService {
    constructor(
        private readonly commentRepository:CommentRepositoryPort
    ){}

    async getCommentsWithFilters(query : any) : Promise<Comment[]>{
        return await this.commentRepository.getCommentsWithFilters(query);
    }

    async getComment(id:string){
        return await this.commentRepository.getComment(id);
    }

    async createComment(comment:RequiredEntityData<Comment>): Promise<Comment |undefined>{
        return await this.commentRepository.createComment(comment);
    }

    async updateComment(id:string, comment:Partial<Comment>): Promise<Comment | null>{
        return await this.commentRepository.updateComment(id,comment)
    }

    async deleteComment(id:string){
        await this.commentRepository.deleteComment(id);
    }

}