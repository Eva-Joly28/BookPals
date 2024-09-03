import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Invoke } from "@glint/template/-private/integration";
import type BookModel from "ember-boilerplate/models/book";
import type RatingModel from "ember-boilerplate/models/rating";
import userModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import { updateRecord } from "ember-boilerplate/utils/update-model";
import { updateInProgress, updatePal, updateRead, updateStatus, updateWishlist } from "ember-boilerplate/utils/updating-collections";
import type FlashMessageService from "ember-cli-flash/services/flash-messages";
import type SessionService from "ember-simple-auth/services/session";

export interface BookActionsSignature {
    Args :{
        book : BookModel;
        setAlert : Function;
        rating: RatingModel;
    }
}

export default class BookActionsComponent extends Component<BookActionsSignature> {

    @service declare session : SessionService;
    @service('current-user') declare currentUser : CurrentUserService;
    @service declare flashMessages : FlashMessageService
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

    get tab(){
        this.args.book.ratings.reload();
        return hasManyToArray(this.args.book.ratings);
    }

    get rating(){
        return this.args.rating;
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

    async toggleOption(book:any, mode:string, relationship:string){
            let user = await this.store.findRecord('user', this.currentUser.user!.id);
            let userRelationship = await user.get(relationship).reload();
            await book.reload();
            if(mode === 'filter'){
                console.log('avant : ',userRelationship);
                await book.reload();
                let id = userRelationship.findIndex((b:any)=>
                    b.id === book.id
                )
                userRelationship.splice(id,1);
                // userRelationship = userRelationship.filter((b:any)=>{
                //     b.id !== book.id
                // })
                console.log('après : ',userRelationship);
            }
            else{
                
                userRelationship.push(book);
            }
            let data = {
                "data": {
                    "id": `${user.id}`,
                    "type": "users",
                    "relationships": {
                        [relationship]: {
                            "data": userRelationship.map((book:any) => ({
                                    type: 'books',
                                    id: book.id,
                                }))
                        }
                    }
                 }
                }
            let response = await updateRecord('users',user.id,data);
    }

    @action
    async togglePal(){
        this.isInPal = !this.isInPal;
        console.log(this.isInPal);
        const book = await this.store.findRecord('book',this.args.book.id);
        const user = await this.store.findRecord('user',this.currentUser.user!.id);
        if(this.isInPal===true){
            if(!user.booksToRead.includes(book)){
                await updatePal(book,'push',user);
                // await this.toggleOption(book,'push','booksToRead');
                this.flashMessages.success('livre ajouté à la pile à lire');
                if(this.isInProgress){
                    this.isInProgress = false;
                    await updateInProgress(book,'filter',user);
                }
                await  updateStatus(user,1);
                // await this.actualUser!.readBooks.reload();
                // await this.actualUser!.booksInProgress.reload()
                // await this.toggleOption(book,'filter','booksInProgress');
                // await this.toggleOption(book,'filter','readBooks');
                
            }
        }
        else{
            if(user.booksToRead.includes(book)){
                await updatePal(book,'filter',user);

                // await this.toggleOption(book,'filter','booksToRead');
            }
        }
        // this.updateStates();
    }

    @action
    async toggleRead(){
        this.isRead = !this.isRead;
        const book = await this.store.findRecord('book',this.args.book.id);
        const user = await this.store.findRecord('user',this.currentUser.user!.id);
        if(this.isRead===true){
            if(!user.readBooks.includes(book)){
                await updateRead(book,'push',user);
                // await this.toggleOption(book,'push','booksToRead');
                this.flashMessages.success('livre ajouté à la pile à lire');
                if(this.isInProgress){
                    this.isInProgress = false;
                    await updateInProgress(book,'filter',user);
                }
                if(this.isInPal){
                    this.isInPal = false;
                    await updatePal(book,'filter',user);
                }
                await  updateStatus(user,1);
                // await this.toggleOption(book,'push','readBooks');
                // this.isInProgress = false;
                // this.isInPal = false;
                // await this.toggleOption(book,'filter','booksInProgress');
                // await this.toggleOption(book,'filter','booksToRead');
                // this.args.setAlert('Ajouté aux livres lus');
            }
        }
        else{
            if(user.readBooks.includes(book)){
                await updateInProgress(book,'filter',user);
            }
        }
        // this.updateStates();

    }

    @action
    async toggleProgress(){
        this.isInProgress = !this.isInProgress;
        const book = await this.store.findRecord('book',this.args.book.id);
        const user = await this.store.findRecord('user',this.currentUser.user!.id);
        if(this.isInProgress===true){
            if(!user.booksInProgress.includes(book)){
                await updateInProgress(book,'push',user);
                this.flashMessages.success('livre ajouté à la pile à lire');
                if(this.isInPal){
                    this.isInPal = false;
                    await updatePal(book,'filter',user);
                }
                await  updateStatus(user,1);
                // await this.toggleOption(book,'push','booksInProgress');
                // this.isInPal = false;
                // this.isRead = false;
                // await this.toggleOption(book,'filter','booksToRead');
                // await this.toggleOption(book,'filter','readBooks');
            }
        }
        else{
            if(user.booksInProgress.includes(book)){
                // await this.toggleOption(book,'filter','booksInProgress');
                await updateInProgress(book, 'filter', user);
            }
        }
        // this.updateStates();

    }

    @action
    async toggleWishlist(){
        this.isInWishlist = !this.isInWishlist;
        const book = await this.store.findRecord('book',this.args.book.id);
        const user = await this.store.findRecord('user',this.currentUser.user!.id);
        if(this.isInWishlist===true){
            if(!user.wishList.includes(book)){
                await updateWishlist(book,'push',user);
                // await this.toggleOption(book,'push','wishList');
            }
        }
        else{
            if(user.wishList.includes(book)){
                await updateWishlist(book,'filter',user);
                // await this.toggleOption(book,'filter','wishList');
            }
        }
        // this.updateStates();

    }
}