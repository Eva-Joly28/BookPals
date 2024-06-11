import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type BookModel from "ember-boilerplate/models/book";
import type Router from "ember-boilerplate/router";
import type LoadingService from "ember-boilerplate/services/load";
import type Store from "ember-boilerplate/services/store";

export default class Search extends Route {
    @service declare store : Store;
    @service declare router : Router;

    async model(params: any){
        try{
            return await this.store.query('book',{title:params.search.replaceAll('-',' '),orderBy:"views",order:"desc",limit:40}) as unknown as BookModel[];
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}