import { commentPatch, commentPost } from "src/api/validators/Comment";
import { Comment } from "src/database/entities/Comment";

export interface CommentControllerPort {
    getWithFilters(params : any) : Promise<Comment[]>;
    create(comment : commentPost) : Promise<any>;
    getOne(id: string):Promise<any>;
    update(id:string,comment: commentPatch): Promise<any>;
    delete(id:string): Promise<void>;
}