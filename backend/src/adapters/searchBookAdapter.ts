import axios from "axios";
import { RequestBodyObject } from "openapi3-ts";
import { BookRepositoryPort } from "../api/ports/out/bookRepositoryPort";
import { apiInfos } from "../config";
import { Book } from "../api/domain/book";

export async function getInfos(bookId: string){
    const response = await axios.get(`${apiInfos.BASE_URL}/${bookId}`,{
        params : {key: apiInfos.API_KEY}
    });
    if(response.data.volumeInfo.imageLinks.medium){
        return {
            categories : separateCategories(response.data.volumeInfo.categories),
            cover: response.data.volumeInfo.imageLinks.medium,
            description: response.data.volumeInfo.description
        }
    }
    return {
        categories : separateCategories(response.data.volumeInfo.categories),
        cover: response.data.volumeInfo.imageLinks.thumbnail,
        description: response.data.volumeInfo.description
    }
    
}

export function separateCategories(categories: any){
    let tab : string[] = Array.from(new Set(categories.flatMap((char: string) => char.split(" / "))));

    return tab;
}

export async function getSpecificDescription(bookId : string){
    const response = await axios.get(`${apiInfos.BASE_URL}/${bookId}`,{
        params : {key: apiInfos.API_KEY}
    });
    return response.data.volumeInfo.description;
    
}

export function returnIsbn(identifiers: any[]){
    let ISBN_10 = "";
    let ISBN_13 = "";
    identifiers.map((i) =>{
        if(i.type = "ISBN_10") ISBN_10 = i.identifier;
        else ISBN_13 = i.identifier;
    })
    return {
        isbn_13: ISBN_13,
        isbn_10: ISBN_10,
    }
}

export async function assignBook(items : any[]){ 
    let books = items.map(async (item:any)=> ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        publishedDate: item.volumeInfo.publishedDate,
        publisher: item.volumeInfo.publisher,
        description: (await getInfos(item.id)).description,
        isbn_13: returnIsbn(item.volumeInfo.industryIdentifiers).isbn_13,
        isbn_10: returnIsbn(item.volumeInfo.industryIdentifiers).isbn_10,
        pageCount: item.volumeInfo.pageCount,
        defaultImage:item.volumeInfo.imageLinks.thumbnail,
        cover: (await getInfos(item.id)).cover,
        categories: (await getInfos(item.id)).categories,
        snippet: item.volumeInfo.searchInfo.textSnippet || "",
        language: item.volumeInfo.language

    }))
    return await Promise.all(books);
}

export class searchBookAdapter implements BookRepositoryPort{

    async getBooksByTitle(query: string): Promise<Book[]> {
        const response = await axios.get(apiInfos.BASE_URL,{
            params : {q: query, key: apiInfos.API_KEY, maxResults: 40, prinType:"books"}
        });
        let tab = query.split("+");
        let books: Book[] = [];
        if(response.data.items && response.data.items.length>=5){
            books = await assignBook(response.data.items);
            return books;
        }
        tab.length>1? tab.pop() : tab = tab;
        let newQuery : string = tab.length>1? tab.join("+") : query;
        (books.length<5 && newQuery===query)? books = await assignBook(response.data.items) :  this.getBooksByTitle(newQuery);

        return books;
    }

    async getBookDetails(id: string): Promise<Book> {
        const response = await axios.get(`${apiInfos.BASE_URL}/${id}`,{
            params : {key: apiInfos.API_KEY}
        });
        const item = response.data;
        const book : Book = {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            publishedDate: item.volumeInfo.publishedDate,
            publisher: item.volumeInfo.publisher,
            description: item.volumeInfo.description,
            isbn_13: item.volumeInfo.industryIdentifiers[1].identifier,
            isbn_10: item.volumeInfo.industryIdentifiers[0].identifier,
            pageCount: item.volumeInfo.pageCount,
            defaultImage:item.volumeInfo.imageLinks.thumbnail,
            cover: item.volumeInfo.imageLinks.medium,
            categories:item.volumeInfo.categories,
            snippet: item.volumeInfo.searchInfo.textSnippet || "",
            language: item.volumeInfo.language
        }
        return book;
    }

    async getBooksBySubject(subject: string): Promise<Book[]> {
        const response = await axios.get(apiInfos.BASE_URL,{
            params : {q: subject, key: apiInfos.API_KEY, maxResults: 40, prinType:"books", langRestrict:"fr"}
        });
        let books : Book[] = await assignBook(response.data.items);
        if(books.length>=35){
           return books;
        }
        const secondResponse = await axios.get(apiInfos.BASE_URL,{
            params : {q: subject, key: apiInfos.API_KEY, maxResults:(35-books.length), prinType:"books"}
        });
        let tab = await assignBook(response.data.items);
        books = [...books,...tab];
        return books;

    }
}