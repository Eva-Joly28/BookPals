import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking";
import { later } from "@ember/runloop";
import type BookModel from "ember-boilerplate/models/book";
import type CommentModel from "ember-boilerplate/models/comment";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";
import sanitizeHtml from "sanitize-html";
import type RatingModel from "ember-boilerplate/models/rating";

export interface PagesBookDetailsSignature {
    Args : {
        model : {book : any, authorsBooks: BookModel[], genreBooks: BookModel[], users: UserModel[]};
    }
}

export default class PagesBookDetailsComponent extends Component<PagesBookDetailsSignature>{
    @service declare store : Store;
    @service declare router : Router;
    @tracked showMore = false;
    @tracked alertText = '';
    @tracked visibility = "invisible";
    @service('current-user') declare currentUser : CurrentUserService;
    @service declare session : SessionService;
    @tracked isOpen = false; 
    @tracked isOpenConfirm = false;
    @tracked isOpenUpdate = false;
    @tracked commentToUpdate = '';
    @tracked commentToDelete = '';

    constructor(owner: unknown, args: PagesBookDetailsSignature['Args']){
      console.log
        super(owner,args);
        this.args.model.book.comments.reload();

    }

    get actualRating(){
      let rate = this.args.model.book.ratings.find((r:any)=>{
        r.user.id===this.currentUser.user?.id;
      })
      return rate;
    }

    get starsArray(){
      if(this.actualRating){
        let tab = [];
          for (let i = 1; i <=this.actualRating.value ; i++) {
              tab.push(i);  
          }
        return tab;
      }
      return [];
    }
    
    get authorBooks() {
        return this.args.model.authorsBooks.filter(book => book.cover.length).slice(0,6);
    }

    get genresBooks() {
        return this.args.model.genreBooks.filter(book => book.cover.length).slice(0,8);
    }

    get userComments() {
      if(this.session.isAuthenticated){
        return this.args.model.book.comments.filter((c:any)=>c.user.id===this.currentUser.user!.id);
      }
      return [];
    }

    get ratings(){
      return this.args.model.book.ratings;

    }

    get comments(){
      // if(this.session.isAuthenticated){
      //   return this.args.model.book.comments.filter((c:any)=>c.user.id!==this.currentUser.user!.id);
      // }
      return this.args.model.book.comments;
    }

    get rating(){
      let rate : RatingModel =  this.args.model.book.ratings.find((r:RatingModel)=> r.user.id === this.currentUser.user!.id);
      console.log(rate);
      return rate
    }


    @action
    onClose(){
      this.isOpen = false;
      this.isOpenConfirm = false;
      this.isOpenConfirm = false;

    }

    @action
    openModal(){
      this.isOpen = true;
    }

    @action
    deleteComment(id : string){
      this.commentToDelete = id;
      this.isOpenConfirm = true;
    }

    @action
    updateComment(id:string){
      this.commentToUpdate = id;
      this.isOpenUpdate = true;
    }

    @action
    async confirmDelete(){
      let comment = this.store.peekRecord('comment', this.commentToDelete);
      await comment.destroyRecord();
      this.isOpenConfirm = false;
      await this.args.model.book.comments.reload();
    }

    @action
    async confirmUpdate(){
      let comment = await this.store.findRecord('comment', this.commentToUpdate);
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

    
    setAlert(text : string){
        this.alertText = text;
        this.visibility = "visible";
        // eslint-disable-next-line ember/no-runloop
        later(() => {this.visibility="invisible"}, 3000);
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