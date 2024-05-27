import { Book } from "src/api/domain/book";

export interface BookRepositoryPort {
    getBooksByTitle(query: string): Promise<Book[]>;
    getBookDetails(isbn: string): Promise<Book>;
    getBooksBySubject(subject:string): Promise<Book[]>;
}