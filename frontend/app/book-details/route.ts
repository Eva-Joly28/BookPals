/* eslint-disable no-self-assign */
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'ember-boilerplate/config/environment';
import type BookModel from 'ember-boilerplate/models/book';
import type userModel from 'ember-boilerplate/models/user';
import type Router from 'ember-boilerplate/router';
import type Store from 'ember-boilerplate/services/store';
import type emberData__store from '@ember-data/store';
import { updateRecord } from 'ember-boilerplate/utils/update-model';
import { toJSON } from 'flatted';
import type CurrentUserService from 'ember-boilerplate/services/current-user';
import type SessionService from 'ember-simple-auth/services/session';

export default class BookDetails extends Route {
    @service declare store : emberData__store;
    @service declare router : Router;
    @service declare session: SessionService;
    @service declare currentUser : CurrentUserService;

    async beforeModel(){
        await this.session.setup();
        if(this.session.isAuthenticated){
            await this.currentUser.load();
        }
    }

    async model(params : any){
        try {
            const book = await this.store.queryRecord('book',{id:params.book_id,include: 'comments,ratings,usersToRead,readBooks,booksInProgress,wishList,likedBy'}) as unknown as BookModel;
            await book.usersToRead.reload();
            let toRead = book.usersToRead;
            console.log(toRead);

            const users = await this.store.findAll('user') as unknown as userModel[];
            let authorsBooks : BookModel[] = [];
            let genreBooks : BookModel[] = [];
            if(book!.authors.length){
                for(const a of book!.authors){
                    const result = await this.store.query('book',{author:(a),orderBy:"views",order:"desc",limit:7}) as unknown as BookModel[];
                    authorsBooks = [...authorsBooks,...result.filter(r => !authorsBooks.some((b)=> b===r)).filter(r =>r.bookId !== book!.bookId)];

                }
            }

            // if(this.currentUser.user){
            //     actualRating = book.ratings.find(r => r.user.id === this.currentUser.user!.id);
            // }
            let bookToUpdate = await this.store.findRecord('book',book!.id)
            bookToUpdate.views = parseInt(bookToUpdate.views)+1;
            let data = {
                "data": {
                    "id": `${book.id}`,
                    "type": "books",
                    "attributes": {
                        "views": bookToUpdate.views
                    }
                    }
                }
            await updateRecord('books',bookToUpdate.id,data);

            return{book,authorsBooks,genreBooks,users}
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}
