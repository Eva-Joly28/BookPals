import { BookRepositoryPort } from "src/api/ports/out/bookRepositoryPort";
import { Book } from "src/api/domain/book";

export class BookService {
    constructor(private bookRepository: BookRepositoryPort) {}

    async searchBooks(query: string): Promise<Book[]> {
        return this.bookRepository.getBooksByTitle(query);
    }

    async searchBookById(id : string): Promise<Book> {
        return this.bookRepository.getBookDetails(id);
    }

    async searchBookByGenre(query: string): Promise<Book[]> {
        return this.bookRepository.getBooksBySubject(query);
    }
}