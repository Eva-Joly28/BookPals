import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileSignature {
    Args: {
        // model:{user : userModel}
        user : userModel
    }
}

export default class ProfileComponent extends Component<ProfileSignature>{
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;


    get followUser(){
        return this.currentUser.user!.following.find((u)=>u.id===this.args.user.id) ? true : false;
    }
}