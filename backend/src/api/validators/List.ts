import { isBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class listPost{
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    status: boolean;

    keyWords: string[];

    @IsNotEmpty()
    books: string[];

    creator: string;
} 

export class listPatch{

    @IsOptional()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    status: boolean;

    @IsOptional()
    keyWords: string[];

    @IsOptional()
    @IsNotEmpty()
    books: string[];

}