import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileGeneralSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileGeneralComponent extends Component<ProfileGeneralSignature>{
    @service declare session : SessionService;

    get bestRatings(){
        let sortedTab = hasManyToArray(this.args.user.ratings).sort((a,b)=> a.value - b.value)
        return sortedTab.slice(0,4);
    }

    get recentRatings(){
        return this.args.user.ratings.slice(0,4);
    } 
}