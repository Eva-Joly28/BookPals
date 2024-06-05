import { Book } from "src/database/entities/Book";

export interface BookControllerPort {
    getAll(search : string): Promise<Book[]>;
    getOne(id: string) : Promise<Book | null>;
    create(book: any) : Promise<Book|undefined>;
    update(id:string,book: any): Promise<Book|null>
    delete(book: any):void;
}