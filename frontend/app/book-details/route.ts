/* eslint-disable no-self-assign */
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'ember-boilerplate/config/environment';
import type BookModel from 'ember-boilerplate/models/book';
import type userModel from 'ember-boilerplate/models/user';
import type Router from 'ember-boilerplate/router';
import type Store from 'ember-boilerplate/services/store';
import type emberData__store from '@ember-data/store';

export default class BookDetails extends Route {
    @service declare store : emberData__store;
    @service declare router : Router;

    async model(params : any){
        try {
            const book = await this.store.queryRecord('book',{id:params.book_id,include: 'comments,ratings,usersToRead,readBooks,booksInProgress,wishList,likedBy'}) as unknown as BookModel;
            await book.usersToRead.reload();
            let toRead = book.usersToRead;
            console.log(toRead);

            // let response = await fetch(`${config.host}/${config.namespace}/books/${params.book_id}`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // })
            
            // const book = await response.json() as unknown as BookModel;
            const users = await this.store.findAll('user') as unknown as userModel[];
            let authorsBooks : BookModel[] = [];
            let genreBooks : BookModel[] = [];
            if(book!.authors.length){
                for(const a of book!.authors){
                    const result = await this.store.query('book',{author:(a),orderBy:"views",order:"desc",limit:7}) as unknown as BookModel[];
                    authorsBooks = [...authorsBooks,...result.filter(r => !authorsBooks.some((b)=> b===r)).filter(r =>r.bookId !== book!.bookId)];

                }
            }
            let bookToUpdate = await this.store.findRecord('book',book!.id)
            bookToUpdate.views = parseInt(bookToUpdate.views)+1;
            bookToUpdate.save();
        
            // if(book.categories.length){
            //     let genres = book.categories.slice(0,3);
            //     for(const g of genres){
            //         const result = await this.store.query('book',{category:(g),orderBy:"views",order:"desc", limit:5}) as unknown as BookModel[];
            //         genreBooks = [...genreBooks,...result.filter(r => !genreBooks.some((b)=> b===r)).filter(r =>r.bookId !== book.bookId)]
            //     }
            // }
            return{book,authorsBooks,genreBooks,users}
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}
