import type { SyncHasMany } from "@ember-data/model";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type BookModel from "ember-boilerplate/models/book";
import type commentModel from "ember-boilerplate/models/comment";
import type RatingModel from "ember-boilerplate/models/rating";
import type userModel from "ember-boilerplate/models/user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileGeneralSignature {
    Args : {
        model : {user:userModel,};
    }
}

export default class ProfileGeneralComponent extends Component<ProfileGeneralSignature>{
    @service declare session : SessionService;
    @service declare store : Store;

    get bestRatings(){
        let sortedTab = hasManyToArray(this.args.model.user.ratings).sort((a,b)=> a.value - b.value)
        return sortedTab.slice(0,4);
    }

    get recentRatings(){
        return hasManyToArray(this.args.model.user.ratings).slice(0,4);
    } 

    get userComments(){
        return hasManyToArray(this.args.model.user.comments).slice(0,2);
    }


}