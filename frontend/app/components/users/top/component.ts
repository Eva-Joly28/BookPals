import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export interface UsersTopSignature {
    Args:{
        user : userModel;
    }
}

export default class UsersTopComponent extends Component<UsersTopSignature>{
    @service declare store : Store;
    @service declare router : Router;
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;

    get topRead() {
        let books : any;
        this.args.user.reload().then((u)=>{
            books = u.readBooks;
        })
        return books;
        //trier la liste de livre lus par rapport aux notes et retourner les trois avec les meilleures notes
    }

    get userComments(){
        let number : any;
        this.args.user.reload().then((u)=>{
            number = u.comments.length;
        })
        return number;
    }

    get userRead(){
        let number : any;
        this.args.user.reload().then((u)=>{
            number = u.booksToRead.length;
        })
        return number;
        // return this.args.user.booksToRead.length;
    }

    @action
    async followUser(){
        this.store.findRecord('user', this.currentUser.user!.id).then(async (user)=>{
            // await user.following.reload();
            // let userToAdd = await this.store.findRecord('user', this.args.user.id);
            // await userToAdd.reload();
            user.get('following').push(this.args.user);
            user.save();
            // await user.reload();
        })
    }

    @action
    goToUser(){
        this.router.transitionTo('profile',this.args.user.username);
    }

    goToReviews(){
        this.router.transitionTo('profile.reviews',this.args.user.username);
    }

    goToReadBooks(){
        this.router.transitionTo('profile.read',this.args.user.username);
    }
}