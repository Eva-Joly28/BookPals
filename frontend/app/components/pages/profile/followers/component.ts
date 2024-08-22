import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileFollowersSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileFollowersComponent extends Component<ProfileFollowersSignature>{
    @service declare session : SessionService;
    @service declare router : Router;

    @action
    goToFollowing(){
        this.router.transitionTo('profile.following', this.args.user.username);
    }
}