import { IsNotEmpty, IsOptional, isURL } from "class-validator";

export class createBookValidator {
    @IsNotEmpty()
    bookId: string;

    @IsNotEmpty()
    title: string;

    authors: string[];

    publishedDate: string;

    publisher:string="";

    @IsOptional()
    description: string;

    isbn10: string="";

    isbn13: string="";

    @IsOptional()
    pageCount: number;

    @IsOptional()
    cover: string = "";

    @IsOptional()
    defaultImage: string = "";

    @IsOptional()
    snippet: string = "";

    categories: string[];

    language: "fr"|"en";

    @IsOptional()
    views:number = 0;

}

export class updateBookValidator{

    @IsOptional()
    title: string;

    @IsOptional()
    authors: string[];

    @IsOptional()
    publishedDate: string;

    @IsOptional()
    publisher:string="";

    @IsOptional()
    description: string;

    @IsOptional()
    isbn10: string="";

    @IsOptional()
    isbn13: string="";

    @IsOptional()
    pageCount: number;

    @IsOptional()
    cover: string = "";

    @IsOptional()
    defaultImage: string = "";

    @IsOptional()
    snippet: string = "";

    @IsOptional()
    categories: string[];

    @IsOptional()
    language: "fr"|"en";

    @IsOptional()
    views:number = 0;
}