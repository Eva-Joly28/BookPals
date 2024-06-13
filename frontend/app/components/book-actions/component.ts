import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export interface BookActionsSignature {
    Args :{
        book : BookModel;
    }
}

export default class BookActionsComponent extends Component<BookActionsSignature> {

    @service declare session : SessionService;
    @service('current-user') declare currentUser : CurrentUserService;
    @service declare store : Store;
    @tracked isInPal = false;
    @tracked isInWishlist = false;
    @tracked isInProgress = false;
    @tracked isRead = false;

    constructor(owner: unknown, args: BookActionsSignature['Args']){
        super(owner,args);
        console.log(this.currentUser.user);
        if(this.pal.some((b) => b.id=== this.args.book.id)){
            this.isInPal = true;
        }
        if(this.wishlist.some((b) => b.id=== this.args.book.id)){
            this.isInWishlist = true;
        }

        if(this.inProgress.some((b) => b.id=== this.args.book.id)){
            this.isInProgress = true;
        }

        if(this.readBooks.some((b) => b.id=== this.args.book.id)){
            this.isRead = true;
        }

    }
    
    get pal(){
        if(this.session.isAuthenticated){
            return this.currentUser.user!.booksToRead as unknown as BookModel[];
        }
        return [];
    }

    get wishlist(){
        if(this.session.isAuthenticated){
            return  hasManyToArray(this.currentUser.user!.wishList);
        }
        return [];
    }

    get inProgress(){
        if(this.session.isAuthenticated){
            return  hasManyToArray(this.currentUser.user!.booksInProgress);
        }
        return [];
    }

    get readBooks(){
        if(this.session.isAuthenticated){
            return  hasManyToArray(this.currentUser.user!.readBooks);
        }
        return [];
    }

    @action
    togglePal(){
        this.isInPal = !this.isInPal;
        if(this.isInPal===true){
            this.store.findRecord('user', this.currentUser.user!.id,{include : 'booksToRead,booksInProgress,readBooks,wishList'}).then((user)=>{
                user.booksToRead = [...user.booksToRead, this.args.book];
                user.save();
            })
        console.log(this.currentUser.user?.booksToRead);
        }
    }

    @action
    toggleRead(){
        this.isRead = !this.isRead;
    }

    @action
    toggleProgress(){
        this.isInProgress = !this.isInProgress;
    }

    @action
    toggleWishlist(){
        this.isInWishlist = !this.isInWishlist;
    }
}