import { RequiredEntityData } from "@mikro-orm/core";
import { Comment } from "src/database/entities/Comment";

export interface CommentRepositoryPort {
    getCommentsWithFilters(query: any): Promise<Comment[]>;
    getComment(id: string): Promise<Comment | null>;
    createComment(book:RequiredEntityData<Comment>): Promise<Comment | undefined>;
    updateComment(id:string,book:Partial<Comment>):Promise<Comment | null>;
    deleteComment(id:string):Promise<void>;
}