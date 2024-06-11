import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type BookModel from 'ember-boilerplate/models/book';
import type Router from 'ember-boilerplate/router';
import type Store from 'ember-boilerplate/services/store';

export default class Index extends Route {
    @service declare store : Store;
    @service declare router : Router;

    async model(){
        try{
            return await this.store.query('book',{orderBy:"views",order:"desc",limit:10}) as unknown as BookModel[];
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }

    }
}
