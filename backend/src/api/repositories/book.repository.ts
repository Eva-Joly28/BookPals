import { GoogleBooksRequester } from "../../utils/google-book-requests";
import { BookRepositoryPort } from "src/core/ports/out/bookRepositoryPort";
import { Book } from "../../database/entities/Book.js";
import { Service } from "typedi";
import { EntityManager, EntityRepository, QueryOrder, RequiredEntityData, SelectQueryBuilder, wrap} from "@mikro-orm/postgresql";
import { NotFoundError } from "routing-controllers";

export interface BookFilters{
    category?:string,
    title?:string,
    author?:string,
    isbn?:string,
    language?:'en'|'fr',
    limit?:number,
    orderBy?:string,
    order?:'asc'|'desc',
}


@Service('bookRepo')
export class BookRepository extends EntityRepository<Book> implements BookRepositoryPort {
    constructor(em:EntityManager){
        super(em,Book);
    }
    
    private requester : GoogleBooksRequester = new GoogleBooksRequester();
    
    async getBooksWithFilters(filters:any) : Promise<Book[]>{
        const qb = this.em.qb(Book).select('*');
 
        this.setupFilters(filters,qb);
        if(filters.limit){
            qb.orderBy({language:'desc'}).limit(parseInt(filters.limit));
        }

        const dbBooks = filters.limit? await qb.getResultList() : await qb.orderBy({language:'desc'}).getResultList();
        console.log(dbBooks.length);
        const externalBooks = await this.fetchBooksFromRequester(filters, dbBooks);

        const bookIds = new Set<string>(dbBooks.map(book => book.bookId));
        const result = [
            ...dbBooks,
            ...externalBooks.filter(book => !bookIds.has(book.bookId)),
        ];
        for (const book of externalBooks) {
            if (await this.findOne({ bookId: book.bookId }) === null) {
                const instance = this.create(book);
                this.em.persistAndFlush(instance);
            }
        }
        
        return result;
        
    }

    async getBookDetails(id: string): Promise<Book | null> {
        try{
            let book = await this.findOneOrFail({bookId:id});
            return book;
        }
        catch(e){
            return this.requester.getBookDetails(id);
        }
    }
    
    async createBook(book: RequiredEntityData<Book>): Promise<Book | undefined> {
        const newBook = new Book();
        wrap(newBook).assign(book);
        await this.em.persistAndFlush(newBook);
        return newBook;
    }
    async updateBook(id: string, book: Partial<Book>): Promise<Book | null> {
        const result = await this.findOneOrFail({ id }, { failHandler: () => new NotFoundError() });
        wrap(result).assign(book);
        await this.em.persistAndFlush(result);
        return result;
    }
    async deleteBook(id: string): Promise<void> {
        const result = await this.findOneOrFail({ id }, { failHandler: () => new NotFoundError() });
        await this.em.removeAndFlush(result);
    }

    private async fetchBooksFromRequester(filters: any, dbBooks: Book[]): Promise<Book[]> {
        let books: Book[] = [];

        if (filters.title && dbBooks.length < 10) {
            books = await this.requester.getBooksBySearch(filters.title);
        } 
        if (filters.category) {
            books = await this.getBooksBySubject(filters.category, dbBooks);
        }
        if (filters.author) {
            books = await this.getBooksByAuthor(filters.author, dbBooks);
        } 
        if (filters.isbn && !dbBooks.length) {
            books = await this.requester.getBooksByIsbn(filters.isbn);
        }
        return books;
    }

    setupFilters(filters:any,qb:SelectQueryBuilder<Book>){
        this.filterTitle(filters,qb);
        this.filterCategory(filters,qb);
        this.filterAuthor(filters,qb);
        this.filterIsbn(filters,qb);
        this.filterOrderBy(filters,qb);
    }

    filterTitle(filters:any,qb:SelectQueryBuilder<Book>){
        if (filters.title) {
            console.log('here title');
            const search = filters.title.replace('+', ' ');
            qb.where({ title: { $ilike: `%${search}%` } });
        }
    }

    filterCategory(filters:any,qb:SelectQueryBuilder<Book>){
        if (filters.category) {
            qb.where({ categories: { $contains: [filters.category] } });
        }
    }

    filterAuthor(filters:any,qb:SelectQueryBuilder<Book>){
        if (filters.author) {
            console.log('here authors');
            qb.where({ authors: { $contains: [filters.author] } });
        }
    }

    filterIsbn(filters:any,qb:SelectQueryBuilder<Book>){
        if (filters.isbn) {
            qb.where({ $or: [{ isbn10: filters.isbn }, { isbn13: filters.isbn }] });
        }
    }

    filterOrderBy(filters:any,qb:SelectQueryBuilder<Book>){
        if(filters.orderBy){
            qb.orderBy({ [filters.orderBy]: filters.order || 'asc' });
        }
    }


    


    async getBooks(title: string): Promise<Book[]> {
        console.log(title);
        const qb = this.em.qb(Book)
        .select('*')
        .where({ title: { $ilike: `%${title}%`}});

        let books = await qb.getResultList();
        let search = title.split(" ")
        if (!books || (books && books.length<10)) {
            books = await this.requester.getBooksBySearch(search.join("+"));
            for (const book of books) {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    books=[...books,book]
                    // const instance = this.create(book);
                    // this.em.persist(instance);
                }
            }
            // await this.em.flush();
        }
        return books;
    }
    
    async getBooksBySubject(subject: string, bdBooks:Book[]): Promise<Book[]> {
        if(!bdBooks || bdBooks.length<81){
            let {books,count} = await this.requester.getBooksBySubject(subject);
            if(bdBooks && (count>bdBooks.length)){
                books.push(...(await this.requester.getBooksBySubject(subject, bdBooks.length + 1)).books);
            }
            const newBooks = await Promise.all(books.map(async book => {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    return book;
                }
                return null;
            }));
            bdBooks.push(...newBooks.filter(book => book !== null) as Book[]);
        }
        return bdBooks;
    }

    async getBooksByAuthor(author: string, bdBooks:Book[]): Promise<Book[]>{
        if(!bdBooks || bdBooks.length<10){
            bdBooks = await this.requester.getBooksByAuthor(author);
            const newBooks = await Promise.all(bdBooks.map(async book => {
                if (await this.findOne({ bookId: book.bookId }) === null) {
                    return book;
                }
                return null;
            }));
            bdBooks = newBooks.filter(book => book !== null) as Book[];
        }
        return bdBooks;
    }

}