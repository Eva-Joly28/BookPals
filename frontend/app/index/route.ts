import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type BookModel from 'ember-boilerplate/models/book';
import type Store from 'ember-boilerplate/services/store';

export default class Index extends Route {
    @service declare store : Store;

    async model(){
        return await this.store.query('book',{popular:true}) as unknown as BookModel[];
        // return await this.store.query('book',{title:"love on the brain"}) as unknown as BookModel[];
    }
}
