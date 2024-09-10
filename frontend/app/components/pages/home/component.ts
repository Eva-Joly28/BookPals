import type Store from "@ember-data/store";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type BookModel from "ember-boilerplate/models/book";
import type CommentModel from "ember-boilerplate/models/comment";
import type RatingModel from "ember-boilerplate/models/rating";
import type Router from "ember-boilerplate/router";
import type SessionService from "ember-simple-auth/services/session";

interface PagesHomeSignature {
    Args: {
        model : {top: BookModel[], choices: BookModel[], recentRatings: RatingModel[], comments: CommentModel[]};
    }
}


export default class PagesHomeComponent extends Component<PagesHomeSignature>{
    @service declare store : Store;
    @service declare router: Router;
    @service declare session : SessionService;


    get topBooks() {
        let topBooks = this.args.model.top.filter(book => book.cover.length || book.defaultImage.length).slice(0,5);
        return topBooks;
    } 

    get recentRatings(){
        return this.args.model.recentRatings.slice(0,5);
    }

    // get newComments(){
    //     return this.args.model.comments.slice(0,4);
    // }

    get weekChoices(){
        return this.args.model.top.filter(book => book.cover.length).slice(5,15);
    }

    @action 
    goToUser(username : string){
        this.router.transitionTo('profile.index', username);
    }

    @action
    goToBook(bookId : string){
    console.log(bookId);
    this.router.transitionTo('books.book', bookId);
  }
    
}