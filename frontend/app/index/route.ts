import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type BookModel from 'ember-boilerplate/models/book';
import type CommentModel from 'ember-boilerplate/models/comment';
import type RatingModel from 'ember-boilerplate/models/rating';
import type Router from 'ember-boilerplate/router';
import type CurrentUserService from 'ember-boilerplate/services/current-user';
import type Store from 'ember-boilerplate/services/store';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import type SessionService from 'ember-simple-auth/services/session';

export default class Index extends Route {
    @service declare store : Store;
    @service declare router : Router;
    @service declare session : SessionService;
    @service('current-user') declare currentUser : CurrentUserService;
    @tracked declare flashMessages : FlashMessageService;

    async beforeModel(){
        await this.session.setup();
        if(this.session.isAuthenticated){
            await this.currentUser.load();
          }
    }

    async model(){
        try{
             let choices = await this.store.query('book',{orderBy:"views",category:"Crime",order:"asc",limit:20}) as unknown as BookModel[];
            let top = await this.store.query('book',{orderBy:"views",order:"desc",limit:10}) as unknown as BookModel[];
            let recentRatings = await this.store.query('rating',{limit:10}) as unknown as RatingModel[];
            console.log(top);
            // let comments = await this.store.findAll('comment') as unknown as commentModel[];
            return {top,choices,recentRatings};
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }

    }

}
