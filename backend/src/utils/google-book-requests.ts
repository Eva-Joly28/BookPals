import axios, { AxiosResponse } from "axios";
import { Book } from "../database/entities/Book";


const apiInfos = {
    BASE_URL : process.env.BASE_URL,
    API_KEY : process.env.API_KEY
}

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
    book.snippet= item.searchInfo? getExtract(item.searchInfo.textSnippet,340): "";
    book.language= item.volumeInfo.language;
    book.views= 0;

    return book;}
    catch(e){
        console.log(e);
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
        console.log(e);
        throw new Error('books cannot be fetched due to an error');
    }
}

export class GoogleBooksRequester {

    async getBooksBySearch(query: string): Promise<Book[]> {
        try{
            const response = await axios.get(apiInfos.BASE_URL!,{
                params : {q: `intitle:${query}`, key: apiInfos.API_KEY, maxResults: 40, langRestrict:'fr', printType:"books"}
            });

            let books = response.data.items ? await assignBook(response.data.items) : [];
            if(response.data.items && response.data.items.length>=5){
                return books;
            }
            else{
                const newQuery = query.split("+").slice(0,-1).length>1 ? query.split("+").slice(0,-1).join('+') : query;
                (books.length<5 && newQuery===query)? books = await assignBook(response.data.items) :  this.getBooksBySearch(newQuery);
                
                if (newQuery !== query) {
                    const newResponse = await axios.get(apiInfos.BASE_URL!, {
                        params: { q: `intitle:${newQuery}`, key: apiInfos.API_KEY, langRestrict:'fr', maxResults: 40, printType: "books" }
                    });
                    books = [...books,...(await assignBook(newResponse.data.items))];
                    if(books.length<=5){
                        const newResponseAll = await axios.get(apiInfos.BASE_URL!, {
                            params: { q: `intitle:${newQuery}`, key: apiInfos.API_KEY, maxResults: 40, printType: "books" }
                        });
                        books = [...books,...(await assignBook(newResponseAll.data.items))];
                    }
                }
                return books;
            }
        }
        catch(e){
            console.error("there is a problem with the search request", e);
            return [] as Book[];
        }
    }

    async getBooksByAuthor(author : string): Promise<Book[]> {
        try{
            const response = await axios.get(apiInfos.BASE_URL!,{
                params : {q: `inauthor:${author}`, key: apiInfos.API_KEY, maxResults: 40, langRestrict:'fr', printType:"books"}
            });
            let books = response.data.items ? await assignBook(response.data.items) : [];
            if(books.length <= 5){
                const newResponse = await axios.get(apiInfos.BASE_URL!,{
                    params : {q: `inauthor:${author}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
                });
                books = [...books,...(await assignBook(newResponse.data.items))];
            }
            return books;
        }
        catch(e){
            console.error("there is a problem with the author request", e);
            return [] as Book[];
        }
    }

    async getBooksByIsbn(isbn : string): Promise<Book[]> {
        try{
            let response = await axios.get(apiInfos.BASE_URL!,{
                params : {q: `isbn:${isbn}`, key: apiInfos.API_KEY, maxResults: 30, printType:"books"}
            });
            return response.data.items ? await assignBook(response.data.items) : [];
        }
        catch(e){
            console.error("there is a problem with the isbn request", e);
            return [] as Book[];
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
            console.error("there is a problem with the details request", e);
            return null;
        }
    }

    async getBooksBySubject(subject: string, startIndex?:number){
        let books : Book[] =[];
        let count = 0;
        try {
            const params: any = { q: `subject:${subject}`, key: apiInfos.API_KEY, maxResults: 40, langRestrict:'fr', printType: "books" };
            if (startIndex) params.startIndex = startIndex;

            const response = await axios.get(apiInfos.BASE_URL!, { params });
            console.log(response.request);
            books = response.data.items? await assignBook(response.data.items) : [];
            if(books.length<20){
                const newResponse = await axios.get(apiInfos.BASE_URL!,{
                    params : {q: `subject:${subject}`, key: apiInfos.API_KEY, maxResults: 40, printType:"books"}
                });
                books = [...books,...(await assignBook(newResponse.data.items))];
            }
            count = response.data.totalItems || 0;
            
        } catch (e) {
            console.error("there is a problem with the subject request", e);
        }
        return { books, count };
    }
}