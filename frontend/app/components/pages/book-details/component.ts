import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type commentModel from "ember-boilerplate/models/comment";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";
import sanitizeHtml from "sanitize-html";

export interface PagesBookDetailsSignature {
    Args : {
        model : {book : any, authorsBooks: BookModel[], genreBooks: BookModel[], users: userModel[]};
    }
}

export default class PagesBookDetailsComponent extends Component<PagesBookDetailsSignature>{
    @service declare store : Store;
    @service declare router : Router;
    @tracked showMore = false;
    @service('current-user') declare currentUser : CurrentUserService;
    @service declare session : SessionService;
    @tracked isOpen = false; 

    constructor(owner: unknown, args: PagesBookDetailsSignature['Args']){
        super(owner,args);

    }
    
    get authorBooks() {
        return this.args.model.authorsBooks.filter(book => book.cover.length).slice(0,6);
    }

    get genresBooks() {
        return this.args.model.genreBooks.filter(book => book.cover.length).slice(0,8);
    }

    get comments(){
    return this.args.model.book.comments;
    //   // let bookComments : commentModel[] = [];
    //   // this.args.model.book.comments.then((comments)=>{
    //   //    bookComments = comments as unknown as commentModel[] ;
    //   // });
    //   // return bookComments;
    }

    get rating(){
      return this.args.model.book.ratings.find((r:any)=> r.user.id === this.currentUser.user!.id)
    }


    @action
    onClose(){
      this.isOpen = false;
    }

    @action
    openModal(){
      this.isOpen = true;
    }

    @action
    gotoBook(id : string){
      this.router.transitionTo('book-details', id);
    }

    @action
    gotoAuthor(author : string){
      this.router.transitionTo('authors', author.replaceAll(' ','-'));
    }

    @action
    gotoGenre(genre : string){
      this.router.transitionTo('genres', genre.replaceAll(' ','-'));
    }

    get description(){
      const clean = sanitizeHtml(this.args.model.book.description, {
        allowedTags:['br','i','p','strong','b'],
        allowedAttributes:{}
      });
      let result = htmlSafe(clean);
      if(result.toString().length<=800 || this.showMore){
        console.log(result);
        return result;
      } 
      else{
        return htmlSafe(this.getExtract(result.toString()))
      }
    }

    @action
    toggleDescription(){
      this.showMore = !this.showMore;
    }

    @action
    getExtract(text:string, maxLength: number = 800){
      if(text.length <= maxLength) {
          return text;
      }
      const extract = text.slice(0,maxLength);
      const lastPeriodIndex = extract.lastIndexOf('.');
      if(lastPeriodIndex !== -1){
          return extract.slice(0,lastPeriodIndex+1);
      }
      return extract;
    }
}