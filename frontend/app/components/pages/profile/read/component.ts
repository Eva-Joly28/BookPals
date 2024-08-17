import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileReadSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileReadComponent extends Component<ProfileReadSignature>{
    @service declare session : SessionService;
    @service declare router : Router;

    @tracked actualCount = 0;
    @tracked serializedArray : BookModel[] = [];

    constructor(owner: unknown, args: ProfileReadSignature['Args']){
        super(owner,args);
        this.serializedArray = this.args.user.readBooks.slice(0,24);
        this.actualCount = this.serializedArray.length;
    }

    @action
    viewMore(){
        this.serializedArray = [...this.serializedArray,...this.args.user.booksInProgress.slice(this.actualCount, this.actualCount+6)]
        this.actualCount = this.actualCount + 8; 
    }

    @action
    goToProfile(){
        this.router.transitionTo('profile.index', this.args.user.username);
    }

}