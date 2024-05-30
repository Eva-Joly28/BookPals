import { Book } from "src/database/entities/Book";

export interface BookRepositoryPort {
    getBooksByTitle(query: string): Promise<Book[]>;
    getBookDetails(isbn: string): Promise<Book| null>;
    getBooksBySubject(subject:string): Promise<Book[]>;
    getBooksByAuthor(author: string): Promise<Book[]>;
}