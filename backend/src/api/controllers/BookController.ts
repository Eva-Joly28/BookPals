import { Body, Delete, Get, JsonController, Param, Patch, Post,Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BookControllerPort } from "../../core/ports/in/BookControllerPort.js";
import { BookRepository } from "../repositories/book.repository.js";
import { Book } from "../../database/entities/Book.js";
import { BookService } from "../../core/services/BookService.js";
import { createBookValidator, updateBookValidator } from "../validators/Book.js";
import { RequiredEntityData } from "@mikro-orm/core";
import { ResponseSchema } from "routing-controllers-openapi";
import { request } from "https";

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
    @ResponseSchema(Book)
    async getAll(@Req() request:any): Promise<Book[]>{
        console.log(request.query);
        return this.bookService.getBooksWithFilters(request.query);
    }
    
    @Get('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async getOne(@Param('id') id:string) : Promise<Book | null>{
        return this.bookService.findBook(id);
    }

    @Post('/',{transformResponse:false})
    @ResponseSchema(Book)
    async create(@Body() book:createBookValidator): Promise<Book|undefined> {
        return this.bookService.createBook(book as RequiredEntityData<Book>);
    }

    @Patch('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async update(@Param('id') id:string, @Body() book: updateBookValidator): Promise<Book |null> {
        return this.bookService.updateBook(id, book as Partial<Book>);
    }

    @Delete('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async delete(@Param('id') id:string){
        await this.bookService.deleteBook(id);
    }

}