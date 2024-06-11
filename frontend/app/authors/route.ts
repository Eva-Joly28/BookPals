import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type BookModel from "ember-boilerplate/models/book";
import type Router from "ember-boilerplate/router";
import type Store from "ember-boilerplate/services/store";

export default class Authors extends Route{
    @service declare store : Store;
    @service declare router : Router;

    async model(params:any){
        try{
            const books = await this.store.query('book',{author:params.author.replaceAll('-',' '),orderBy:"views",order:"desc",limit:40}) as unknown as BookModel[];
            const author = params.author.replaceAll('-',' ');
            return {books,author}
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}