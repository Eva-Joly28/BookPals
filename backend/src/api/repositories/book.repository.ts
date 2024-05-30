import { GoogleBooksRequester } from "../../adapters/searchBookAdapter";
import { BookRepositoryPort } from "src/core/ports/out/bookRepositoryPort";
import { Book } from "../../database/entities/Book.js";
import { Service } from "typedi";
import { EntityManager, EntityRepository} from "@mikro-orm/postgresql";


@Service('bookRepo')
export class BookRepository extends EntityRepository<Book> implements BookRepositoryPort {
    constructor(em:EntityManager){
        super(em,Book);
    }

    private adapter : GoogleBooksRequester = new GoogleBooksRequester();
    async getBooksByTitle(title: string): Promise<Book[]> {
        console.log(title);
        const qb = this.em.qb(Book)
        .select('*')
        .where({ title: { $ilike: `%${title}%`}, language: "fr" });

        let books = await qb.getResultList();
        let search = title.split(" ")
        console.log(books.length);
        if (books.length < 1) {
            books = await this.adapter.getBooksBySearch(search.join("+"));
            let tab : Book[]= [];
            for (const book of books) {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    const instance = this.create(book);
                    this.em.persist(instance);
                    tab = [...tab, instance];
                }
            }
            await this.em.flush();
        } else if(books.length<5) {
            let query = this.em.qb(Book)
            .select('*')
            .where({ title: { $ilike: `%${title}%`}, language: "en" })
            .limit(5);
            let tab = await query.getResultList();
            books = tab.length>0? [...books,...tab]:books;
        }

        return books;
    }
    async getBookDetails(id: string): Promise<Book| null> {
        let book = await this.findOneOrFail({bookId:id});
        return book;
    }
    async getBooksBySubject(subject: string): Promise<Book[]> {
        let books = await this.find({categories:{$contains: [subject]}});
        if(!books || books.length<35){
            books = await this.adapter.getBooksBySubject(subject);
            for (const book of books) {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    books = [...books, book];
                    const instance = this.create(book);
                    this.em.persist(instance);
                }
            }
            await this.em.flush(); 
        }
        return books;
    }

    async getBooksByAuthor(author: string): Promise<Book[]>{
        let books = await this.find({authors:{$contains: [author]}});
        if(!books){
            books = await this.adapter.getBooksByAuthor(author);
            for (const book of books) {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    books = [...books, book];
                    const instance = this.create(book);
                    this.em.persist(instance);
                }
            }
            await this.em.flush(); 
        }
        return books;
    }

}