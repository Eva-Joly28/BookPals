import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Invoke } from "@glint/template/-private/integration";
import type BookModel from "ember-boilerplate/models/book";
import userModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import { updateRecord } from "ember-boilerplate/utils/update-model";
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
    @tracked declare actualUser: userModel;
    @tracked declare actualBook: BookModel;

    constructor(owner: unknown, args: BookActionsSignature['Args']){
        super(owner,args);
        this.store.findRecord('book',this.args.book.id).then((book)=>{
            this.actualBook = book;
        })
        this.loadData();

    }

    
    get pal(){
        if(this.session.isAuthenticated){
            return this.actualUser!.booksToRead as unknown as BookModel[];
        }
        return [];
    }

    get wishlist(){
        if(this.session.isAuthenticated){
            return hasManyToArray(this.actualUser!.wishList);
        }
        return [];
    }

    get inProgress(){
        if(this.session.isAuthenticated){
            return  hasManyToArray(this.actualUser!.booksInProgress);
        }
        return [];
    }

    get readBooks(){
        if(this.session.isAuthenticated){
            return  hasManyToArray(this.actualUser!.readBooks);
        }
        return [];
    }

    async loadData() {
        this.actualBook = await this.store.findRecord('book', this.args.book.id);
        await this.reloadUser();
        this.updateStates();
    }

    async reloadUser() {
        const user = await this.store.findRecord('user', this.currentUser.user!.id);
        await user.reload();
        this.actualUser = user;
    }

    updateStates() {
        if (this.pal.some((b) => b.id === this.args.book.id)) {
            this.isInPal = true;
        }
        if (this.wishlist.some((b) => b.id === this.args.book.id)) {
            this.isInWishlist = true;
        }
        if (this.inProgress.some((b) => b.id === this.args.book.id)) {
            this.isInProgress = true;
        }
        if (this.readBooks.some((b) => b.id === this.args.book.id)) {
            this.isRead = true;
        }
    }

    @action
    async togglePal(){
        this.isInPal = !this.isInPal;
        const book = await this.store.findRecord('book',this.args.book.id);
        const user = await this.store.findRecord('user',this.currentUser.user!.id);
        if(this.isInPal===true){
            if(!user.booksToRead.includes(book)){
                // await user.booksToRead.reload();
                // user.booksToRead = [...user.booksToRead,book];
                // await user.save();
                // await this.reloadUser();
                this.store.findRecord('user', this.currentUser.user!.id).then(async (user)=>{
                        // await this.reloadUser();
                        await user.booksToRead.reload();
                        await book.reload();
                        // console.log(book);
                        // await book.usersToRead.reload();
                        user.booksToRead.push(book);
                        let data = {
                            "data": {
                                "id": `${user.id}`,
                                "type": "users",
                                "relationships": {
                                "booksToRead": {
                                    "data": user.booksToRead
                                },
                               
                                }
                                }
                            }
                        let response = await updateRecord('users',user.id,data);
                        console.log(user.booksToRead);
                        // await user.booksToRead.reload();
                        // user.save();
                        await this.reloadUser();

                })
            }
        // console.log(this.currentUser.user?.booksToRead);
        }
        else{
            if(user.booksToRead.includes(book)){
                this.store.findRecord('user', this.currentUser.user!.id).then(async (user)=>{
                    user.booksToRead = user.booksToRead.filter((book:any)=>{
                        book.id !== this.args.book.id
                    })
                    user.save();
                    await this.reloadUser();
                })
            }
        }
        this.updateStates();
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