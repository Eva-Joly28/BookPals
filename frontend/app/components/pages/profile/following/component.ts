import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileFollowingSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileFollowingComponent extends Component<ProfileFollowingSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked hasRights = false;

    constructor(owner: unknown, args: ProfileFollowingSignature['Args']){
        super(owner,args);
        if(this.session.isAuthenticated){
            if(this.args.user.id === this.currentUser.user!.id){
                this.hasRights = true;
            }
        }
    }
    

    @action
    goToFollowers(){
        this.router.transitionTo('profile.followers', this.args.user.username);
    }

    @action
    goToBlocked(){
        this.router.transitionTo('profile.blocked', this.args.user.username);
    }
}