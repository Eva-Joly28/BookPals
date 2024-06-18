import { ratingPost } from "src/api/validators/Rating";
import { Rating } from "src/database/entities/Rating";

export interface RatingControllerPort {
    getWithFilters(params : any) : Promise<Rating[]>;
    create(rating : ratingPost) : Promise<any>;
    getOne(id: string):Promise<any>;
    update(id:string,book: any): Promise<any>;
    delete(id:string) : Promise<void>;
}