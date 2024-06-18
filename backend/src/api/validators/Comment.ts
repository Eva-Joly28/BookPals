import { IsNotEmpty, IsOptional } from "class-validator";

export class commentPost {
    @IsNotEmpty()
    comment : string;

    user : string;

    book: string;

}

export class commentPatch {

    @IsOptional()
    comment: string;
}