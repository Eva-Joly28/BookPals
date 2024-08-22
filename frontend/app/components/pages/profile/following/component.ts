import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileFollowingSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileFollowingComponent extends Component<ProfileFollowingSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    

    @action
    goToFollowers(){
        this.router.transitionTo('profile.followers', this.args.user.username);
    }
}