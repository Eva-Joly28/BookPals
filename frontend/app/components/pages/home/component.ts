import type Store from "@ember-data/store";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type BookModel from "ember-boilerplate/models/book";
import type Router from "ember-boilerplate/router";

interface PagesHomeSignature {
    Args: {
        model : BookModel[];
    }
}


export default class PagesHomeComponent extends Component<PagesHomeSignature>{
    @service declare store : Store;
    @service declare router: Router;

    get topBooks() {
        let topBooks = this.args.model.filter(book => book.cover.length).slice(0,5);
        return topBooks;
    } 

    @action
    goToBook(bookId : string){
    console.log(bookId);
    this.router.transitionTo('books.book', bookId);
  }
    
}