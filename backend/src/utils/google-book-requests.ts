import axios, { AxiosResponse } from "axios";
import { apiInfos } from "../config";
import { Book } from "../database/entities/Book";
import { Query } from "@mikro-orm/migrations";

export function getInfos(response : AxiosResponse){
    let infos = {
        categories : separateCategories(response.data.volumeInfo.categories),
        cover : "",
        description:"",
    }
    infos.cover = response.data.volumeInfo.imageLinks? response.data.volumeInfo.imageLinks.thumbnail : "";
    infos.description = response.data.volumeInfo.description? getExtract(response.data.volumeInfo.description) : "";
    if(response.data.volumeInfo.imageLinks){
        infos.cover = response.data.volumeInfo.imageLinks.medium? response.data.volumeInfo.imageLinks.medium : "";
    }
    return infos;
    
}

export function separateCategories(categories?: any){
    let tab : string[] = categories? Array.from(new Set(categories.flatMap((char: string) => char.split(" / ")))) : [];
    return tab;
}

export function getExtract(text:string, maxLength: number = 1000){
    if(text.length <= maxLength) {
        return text;
    }
    const extract = text.slice(0,maxLength);
    const lastPeriodIndex = extract.lastIndexOf('.');
    if(lastPeriodIndex !== -1){
        return extract.slice(0,lastPeriodIndex+1);
    }
    return extract+'...';
}

export function returnIsbn(identifiers?: any[]){
    let ISBN_10 = "";
    let ISBN_13 = "";
    if (identifiers) {
        identifiers.forEach((i) => {
          if (i.type === "ISBN_10") {
            ISBN_10 = i.identifier;
          } else if (i.type === "ISBN_13") {
            ISBN_13 = i.identifier;
          }
        });
      }
    return {
        isbn_13: ISBN_13,
        isbn_10: ISBN_10,
    }
}

export async function assign(item:any){
    try{
    const response = await axios.get(`${apiInfos.BASE_URL}/${item.id}`,{
        params : {key: apiInfos.API_KEY}
    });
    const { isbn_10, isbn_13 } = returnIsbn(item.volumeInfo.industryIdentifiers);
    const { categories, cover, description } = getInfos(response);
    let book:Book = new Book();
    book.bookId = item.id;
    book.title= getExtract(item.volumeInfo.title,200);
    book.authors= item.volumeInfo.authors || [];
    book.publishedDate= item.volumeInfo.publishedDate || "";
    book.publisher= item.volumeInfo.publisher || "";
    book.description= description;
    book.isbn13= isbn_13
    book.isbn10= isbn_10;
    book.pageCount= item.volumeInfo.pageCount || 0;
    book.defaultImage= item.volumeInfo.imageLinks? item.volumeInfo.imageLinks.thumbnail : "";
    book.cover= cover;
    book.categories= categories;
    book.snippet= item.searchInfo? item.searchInfo.textSnippet: "";
    book.language= item.volumeInfo.language;

    return book;}
    catch(e){
        throw new Error('request to google books api failed');
    }
}

export async function assignBook(items : any[]){ 
    try{
    let books : Book[] =[];

    const frItems = items.filter(item => item.volumeInfo.language === "fr");
    const enItems = items.filter(item => item.volumeInfo.language === "en");

    const tasksFr = frItems.map(async item => {
        const book = await assign(item);
        const exists = books.some(b => b.bookId === book.bookId);
        if (!exists) books.push(book);
    });

    await Promise.all(tasksFr);

    if (books.length < 10) {
        const tasksEn = enItems.map(async item => {
            const book = await assign(item);
            const exists = books.some(b => b.bookId === book.bookId);
            if (!exists) books.push(book);
        });
        await Promise.all(tasksEn);
    }

    return await Promise.all(books);}
    catch(e){
        console.log('books cannot be fetched due to an error',e);
        throw new Error('books cannot be fetched due to an error');
    }
}

export class GoogleBooksRequester {

    async getBooksBySearch(query: string): Promise<Book[]> {
        try{
            const response = await axios.get(apiInfos.BASE_URL,{
                params : {q: `intitle:${query}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
            });

            let books = response.data.items ? await assignBook(response.data.items) : [];
            if(response.data.items && response.data.items.length>=5){
                return books;
            }
            else{
                const newQuery = query.split("+").slice(0,-1).length>1 ? query.split("+").slice(0,-1).join('+') : query;
                (books.length<5 && newQuery===query)? books = await assignBook(response.data.items) :  this.getBooksBySearch(newQuery);
                
                if (newQuery !== query) {
                    const newResponse = await axios.get(apiInfos.BASE_URL, {
                        params: { q: `intitle:${newQuery}`, key: apiInfos.API_KEY, maxResults: 40, printType: "books" }
                    });
                    books = [...books,...(await assignBook(newResponse.data.items))];
                }
                return books;
            }
        }
        catch(e){
            console.error("there is a problem with the search request", e);
            throw new Error("there is a problem with the search request")
        }
    }

    async getBooksByAuthor(author : string): Promise<Book[]> {
        try{
            const response = await axios.get(apiInfos.BASE_URL,{
                params : {q: `inauthor:${author}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
            });
            return response.data.items ? await assignBook(response.data.items) : [];
        }
        catch(e){
            throw new Error("there is a problem with the author request")
        }
    }

    async getBooksByIsbn(isbn : string): Promise<Book[]> {
        try{
            let response = await axios.get(apiInfos.BASE_URL,{
                params : {q: `isbn:${isbn}`, key: apiInfos.API_KEY, maxResults: 30, printType:"books"}
            });
            return response.data.items ? await assignBook(response.data.items) : [];
        }
        catch(e){
            throw new Error("there is a problem with the isbn request")
        }
    }

    async getBookDetails(id: string): Promise<Book |null> {
        try{
            const response = await axios.get(`${apiInfos.BASE_URL}/${id}`,{
                params : {key: apiInfos.API_KEY}
            });
            return response.data ? assign(response.data) : null;
        }
        catch(e){
            throw new Error("there is not a book with the given id");
        }
    }

    async getBooksBySubject(subject: string, startIndex?:number){
        try {
            const params: any = { q: `subject:${subject}`, key: apiInfos.API_KEY, maxResults: 40, printType: "books" };
            if (startIndex) params.startIndex = startIndex;

            const response = await axios.get(apiInfos.BASE_URL, { params });
            const books = response.data.items? await assignBook(response.data.items) : [];
            const count = response.data.totalItems || 0;

            return { books, count };
        } catch (e) {
            console.error("there is a problem with the subject request", e);
            throw new Error("there is a problem with the subject request");
        }

    }
}