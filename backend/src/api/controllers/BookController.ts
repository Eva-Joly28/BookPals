import { Body, Delete, Get, JsonController, Param, Patch, Post,Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BookControllerPort } from "../../core/ports/in/BookControllerPort.js";
import { BookRepository } from "../repositories/book.repository.js";
import { Book } from "../../database/entities/Book.js";
import { BookService } from "../../core/services/BookService.js";
import { createBookValidator, updateBookValidator } from "../validators/Book.js";
import { RequiredEntityData } from "@mikro-orm/core";
import { ResponseSchema } from "routing-controllers-openapi";
import JsonApiDeserializer from "../../utils/deserializer";
import { request } from "https";
import JsonApiSerializer from "../../utils/jsonapi-serializer.js";
import { validateOrReject } from "class-validator";

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
    async getAll(@Req() request:any){
        let results = await this.bookService.getBooksWithFilters(request.query);
        return JsonApiSerializer.serializeBooks(results);
    }
    
    @Get('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async getOne(@Param('id') id:string){
       let result = await this.bookService.findBook(id);
       return result!=null? JsonApiSerializer.serializeBook(result) : undefined;

    }

    @Post('/',{transformResponse:false})
    @ResponseSchema(Book)
    async create(@Body() book:any) {
        let deserializedBook = JsonApiDeserializer.deserializeBook(book);
        await validateOrReject(Object.assign(new createBookValidator(), deserializedBook));
        let createdbook = await this.bookService.createBook(deserializedBook as RequiredEntityData<Book>);
        return createdbook? createdbook : undefined;
    }

    @Patch('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async update(@Param('id') id:string, @Body() book: any){
        let deserializedBook = JsonApiDeserializer.deserializeBook(book) as updateBookValidator;
        await validateOrReject(Object.assign(new updateBookValidator(), deserializedBook));
        let updatedBook = await this.bookService.updateBook(id, deserializedBook as unknown as Partial<Book>);
        return updatedBook!== null ? JsonApiSerializer.serializeBook(updatedBook) : undefined;
    }

    @Delete('/:id',{transformResponse:false})
    @ResponseSchema(Book)
    async delete(@Param('id') id:string){
        await this.bookService.deleteBook(id);
    }

}