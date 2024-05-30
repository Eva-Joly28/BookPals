import axios, { AxiosResponse } from "axios";
import { apiInfos } from "../config";
import { Book } from "../database/entities/Book";

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
    let books : Book[] =[];
    try{
    for (const item of items) {
        if (item.volumeInfo.language === "fr") {
            const book = await assign(item);
            const exists = books.some(b => b.bookId === book.bookId);
            if(!exists) {books.push(book);}
        }
    }
    if(books.length<5){
        for (const item of items) {
            if (item.volumeInfo.language === "en") {
                const book = await assign(item);
                const exists = books.some(b => b.bookId === book.bookId);
                if(!exists) {books.push(book);}
            }
        }
    }
    return await Promise.all(books);}
    catch(e){
        throw new Error('books cannot be fetched due to an error')
    }
}

export class GoogleBooksRequester {

    async getBooksBySearch(query: string): Promise<Book[]> {
        try{
            let response = await axios.get(apiInfos.BASE_URL,{
                params : {q: `intitle:${query} OR inauthor:${query}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
            });
            let tab = query.split("+");
            let books: Book[] = [];
            if(response.data.items && response.data.items.length>=5){
                books = await assignBook(response.data.items);
                return books;
            }
            else{
            tab.length>1? tab.pop() : tab = tab;
            let newQuery : string = tab.length>1? tab.join("+") : query;
            (books.length<5 && newQuery===query)? books = await assignBook(response.data.items) :  this.getBooksBySearch(newQuery);
            }
            return books;
        }
        catch(e){
            throw new Error("there is a problem with the search request")
        }
    }

    async getBooksByAuthor(author : string): Promise<Book[]> {
        try{
            let response = await axios.get(apiInfos.BASE_URL,{
                params : {q: `inauthor:${author}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
            });
            let books: Book[] = [];
            if(response.data.items ){
                books = await assignBook(response.data.items);
        }
        return books;
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
            let books: Book[] = [];
            if(response.data.items ){
                books = await assignBook(response.data.items);
            }
            return books;
        }
        catch(e){
            throw new Error("there is a problem with the isbn request")
        }
    }

    async getBookDetails(id: string): Promise<Book> {
        try{
            const response = await axios.get(`${apiInfos.BASE_URL}/${id}`,{
                params : {key: apiInfos.API_KEY}
            });
            const item = response.data;
            const book = assign(item);
            return book;
        }
        catch(e){
            throw new Error("there is not a book with the given id");
        }
    }

    async getBooksBySubject(subject: string): Promise<Book[]> {
        const response = await axios.get(apiInfos.BASE_URL,{
            params : {q: `subject:${subject}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
        });
        let books : Book[] = await assignBook(response.data.items);
        return books;

    }
}