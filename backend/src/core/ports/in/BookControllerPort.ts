import { Book } from "src/database/entities/Book";

export interface BookControllerPort {
    getAll(search : string): Promise<Book[]>;
    getOne(id: string) : Promise<Book | null>;
    getBySubject(subject: string) : Promise<Book[]>;
}