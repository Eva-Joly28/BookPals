import { Book } from "src/database/entities/Book";

export interface BookControllerPort {
    getAll(search : string): Promise<any>;
    getOne(id: string) :Promise<any>;
    create(book: any) : Promise<any>;
    update(id:string,book: any): Promise<any>
    delete(book: any):void;
}