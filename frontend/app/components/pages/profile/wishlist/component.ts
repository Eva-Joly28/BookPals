import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type UserModel from "ember-boilerplate/models/user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileWishlistSignature {
    Args : {
        user : UserModel;
    }
}

export default class ProfileWishlistComponent extends Component<ProfileWishlistSignature>{
    @service declare session : SessionService;

    @tracked actualCount = 0;
    @tracked serializedArray : BookModel[] = [];

    constructor(owner: unknown, args: ProfileWishlistSignature['Args']){
        super(owner,args);
        this.serializedArray = this.args.user.wishList.slice(0,24);
        this.actualCount = this.serializedArray.length;
    }

    @action
    viewMore(){
        this.serializedArray = [...this.serializedArray,...this.args.user.booksInProgress.slice(this.actualCount, this.actualCount+6)]
        this.actualCount = this.actualCount + 8; 
    }
}