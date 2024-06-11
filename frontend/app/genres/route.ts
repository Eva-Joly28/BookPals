import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type BookModel from "ember-boilerplate/models/book";
import type Router from "ember-boilerplate/router";
import type LoadingService from "ember-boilerplate/services/load";
import type Store from "ember-boilerplate/services/store";

export default class Authors extends Route{
    @service declare store : Store;
    @service declare router : Router;

    async model(params:any){
        try{
            const books = await this.store.query('book',{category:params.genre.replaceAll('-',' '),orderBy:"views",order:"desc",limit:40}) as unknown as BookModel[];
            const genre = params.genre.replaceAll('-',' ');
            return {books,genre}
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}