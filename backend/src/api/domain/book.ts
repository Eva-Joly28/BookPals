export interface Book {
    id: string;
    title: string;
    authors: string[];
    publishedDate: string;
    publisher: string;
    description:string;
    isbn_10:string;
    isbn_13:string;
    pageCount:number;
    defaultImage?:string;
    cover?:string;
    categories:string[];
    snippet:string;
    language:string;

}