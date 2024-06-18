import { RequiredEntityData } from "@mikro-orm/core";
import { Rating } from "src/database/entities/Rating";

export interface RatingRepositoryPort {
    getRatingsWithFilters(query: any): Promise<Rating[]>;
    getRating(id: string): Promise<Rating | null>;
    createRating(book:RequiredEntityData<Rating>): Promise<Rating | undefined>;
    updateRating(id:string,book:Partial<Rating>):Promise<Rating | null>;
    deleteRating(id:string):Promise<void>;
}