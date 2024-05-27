import { Book } from "src/api/domain/book";

export interface BookControllerPort {
    getAll(search : string): Promise<Book[]>;
    getOne(id: string) : Promise<Book>;
    getBySubject(subject: string) : Promise<Book[]>;
}