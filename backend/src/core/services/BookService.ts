import { Service } from "typedi";
import { BookRepositoryPort } from "../ports/out/bookRepositoryPort";
import { Book } from "src/database/entities/Book";
import { RequiredEntityData } from "@mikro-orm/core";

@Service('bookService')
export class BookService {
    constructor(
        private readonly bookRepository:BookRepositoryPort
    ){}

    async getBooksWithFilters(query : any) : Promise<Book[]>{
        return await this.bookRepository.getBooksWithFilters(query);
    }

    async findBook(bookId:string){
        return await this.bookRepository.getBookDetails(bookId);
    }

    async createBook(book:RequiredEntityData<Book>): Promise<Book |undefined>{
        return await this.bookRepository.createBook(book);
    }

    async updateBook(id:string, book:Partial<Book>): Promise<Book | null>{
        return await this.bookRepository.updateBook(id,book)
    }

    async deleteBook(id:string){
        await this.bookRepository.deleteBook(id);
    }

}