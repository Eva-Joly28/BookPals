import { IsNotEmpty, IsOptional } from "class-validator";

export class ratingPost {
    @IsNotEmpty()
    value: number;

    user: string;

    book: string;

}

export class ratingPatch {

    @IsOptional()
    value: number;
}