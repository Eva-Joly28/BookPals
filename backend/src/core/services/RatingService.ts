import { Service } from "typedi";
import { Rating } from "src/database/entities/Rating";
import { RequiredEntityData } from "@mikro-orm/core";
import { CommentRepositoryPort } from "../ports/out/commentRepositoryPort";
import { RatingRepositoryPort } from "../ports/out/ratingRepositoryPort";

@Service('ratingService')
export class RatingService {
    constructor(
        private readonly ratingRepository:RatingRepositoryPort
    ){}

    async getRatingsWithFilters(query : any) : Promise<Rating[]>{
        return await this.ratingRepository.getRatingsWithFilters(query);
    }

    async getRating(bookId:string){
        return await this.ratingRepository.getRating(bookId);
    }

    async createRating(book:RequiredEntityData<Rating>): Promise<Rating |undefined>{
        return await this.ratingRepository.createRating(book);
    }

    async updateRating(id:string, Rating:Partial<Rating>): Promise<Rating | null>{
        return await this.ratingRepository.updateRating(id,Rating)
    }

    async deleteRating(id:string){
        await this.ratingRepository.deleteRating(id);
    }

}