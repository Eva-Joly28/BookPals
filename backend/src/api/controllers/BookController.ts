import { Get, JsonController, Param, QueryParam } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BookControllerPort } from "../../core/ports/in/BookControllerPort.js";
import { BookRepository } from "../repositories/book.repository.js";
import { Book } from "src/database/entities/Book.js";
import { BookService } from "../../core/services/BookService.js";

@JsonController('/books')
@Service()
export class BookController implements BookControllerPort {
    constructor(
        @Inject('bookRepo') private readonly bookRepository:BookRepository,
        @Inject('bookService') private bookService: BookService
    ) {
        this.bookService = new BookService(bookRepository);
    }
    
    @Get('/',{transformResponse:false})
    async getAll(@QueryParam('title') search:string): Promise<Book[]>{
        let tab = search.split("+");
        const query = tab.join(" ")
        return this.bookService.getBooksBySearch(query);
    }
    
    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id:string) : Promise<Book | null>{
        return this.bookService.getBookDetails(id);
    }
    
    @Get('/genres',{transformResponse:false})
    async getBySubject(@QueryParam('subject') subject: string): Promise<Book[]> {
        return this.bookService.getBooksByCategory(subject);
    }

    @Get('/author/:author',{transformResponse:false})
    async getByAuthor(@Param('author') author: string): Promise<Book[]> {
        return this.bookService.getBooksByAuthor(author);
    }

    @Get('/book/popular',{transformResponse:false})
    async getPopular(): Promise<Book[]> {
        return this.bookRepository.getPopular();
    }

}