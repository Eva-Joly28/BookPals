import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type BookModel from 'ember-boilerplate/models/book';
import type userModel from 'ember-boilerplate/models/user';
import type Router from 'ember-boilerplate/router';
import type Store from 'ember-boilerplate/services/store';

export default class BookDetails extends Route {
    @service declare store : Store;
    @service declare router : Router;

    async model(params : any){
        try {
            const book = await this.store.findRecord('book', params.book_id);
            const users = await this.store.findAll('user') as unknown as userModel[];
            let authorsBooks : BookModel[] = [];
            let genreBooks : BookModel[] = [];
            if(book.authors.length){
                for(const a of book.authors){
                    const result = await this.store.query('book',{author:(a),orderBy:"views",order:"desc",limit:7}) as unknown as BookModel[];
                    authorsBooks = [...authorsBooks,...result.filter(r => !authorsBooks.some((b)=> b===r)).filter(r =>r.bookId !== book.bookId)];

                }
            }
            this.store.findRecord('book',book.id).then(function(book){
                book.views = parseInt(book.views)+1;
                book.save();
            })
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
