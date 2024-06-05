import { RequiredEntityData } from "@mikro-orm/core";
import { BookFilters } from "src/api/repositories/book.repository";
import { Book } from "src/database/entities/Book";

export interface BookRepositoryPort {
    getBooksWithFilters(query: BookFilters): Promise<Book[]>;
    getBookDetails(id: string): Promise<Book | null>;
    createBook(book:RequiredEntityData<Book>): Promise<Book | undefined>;
    updateBook(id:string,book:Partial<Book>):Promise<Book | null>;
    deleteBook(id:string):Promise<void>;
}