import { Get, JsonController, Param, QueryParam } from "routing-controllers";
import { searchBookAdapter } from "../../adapters/searchBookAdapter.js";
import { BookService } from "../../core/services/BookService.js";
import { Book } from "../../api/domain/book.js";
import { Service } from "typedi";
import { BookControllerPort } from "../ports/in/BookControllerPort.js";

@JsonController('/search')
@Service()
export class BookController implements BookControllerPort {
    constructor(public bookService = new BookService(new searchBookAdapter())) {}
    
    @Get('/')
    async getAll(@QueryParam('title') search:string): Promise<Book[]>{
        const query = `intitle:${search} OR inauthor:${search}`
        return this.bookService.searchBooks(query);
    }
    
    @Get('/:id')
    async getOne(@Param('id') id:string) : Promise<Book>{
        return this.bookService.searchBookById(id);
    }
    
    @Get('/genres')
    async getBySubject(@QueryParam('subject') subject: string): Promise<Book[]> {
        const query = `subject:${subject}`;
        return this.bookService.searchBookByGenre(query);
    }

}