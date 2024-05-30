import { Service } from "typedi";
import { BookRepositoryPort } from "../ports/out/bookRepositoryPort";
import { Book } from "src/database/entities/Book";

@Service('bookService')
export class BookService {
    constructor(
        private readonly bookRepository:BookRepositoryPort
    ){}

    async getBooksBySearch(search : string) : Promise<Book[]>{
        return await this.bookRepository.getBooksByTitle(search);
    }

    async getBookDetails(bookId : string) : Promise<Book | null>{
        return await this.bookRepository.getBookDetails(bookId);
    }

    async getBooksByCategory(subject : string) : Promise<Book[]>{
        return await this.bookRepository.getBooksBySubject(subject);
    }

    async getBooksByAuthor(author : string) : Promise<Book[]>{
        return await this.bookRepository.getBooksByAuthor(author);
    }
}