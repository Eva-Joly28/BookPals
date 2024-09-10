import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileSignature {
    Args: {
        // model:{user : userModel}
        user : UserModel
    }
}

export default class ProfileComponent extends Component<ProfileSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;


    get followUser(){
        return this.currentUser.user!.following.find((u)=>u.id===this.args.user.id) ? true : false;
    }

    get blockedUser(){
        return this.currentUser.user!.blockedUsers.find((u)=>u.id===this.args.user.id) ? true : false;
    }

    @action
    sendMessage(){
        this.router.transitionTo('profile.messages.new', this.currentUser.user?.username, this.args.user.username);
    }

    @action
    goToUser(){
        this.router.transitionTo('profile',this.args.user.username);
    }
}