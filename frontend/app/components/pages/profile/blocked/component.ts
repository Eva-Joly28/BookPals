import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileBlockedSignature {
    Args : {
        user : UserModel;
    }
}

export default class ProfileBlockedComponent extends Component<ProfileBlockedSignature>{
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;
    @service declare router : Router;
    @tracked hasRights = false;

    constructor(owner: unknown, args: ProfileBlockedSignature['Args']){
        super(owner,args);
        if(this.session.isAuthenticated){
            if(this.args.user.id === this.currentUser.user!.id){
                this.hasRights = true;
            }
        }
    }

    @action
    goToFollowing(){
        this.router.transitionTo('profile.following', this.args.user.username);
    }

    @action
    goToBlocked(){
        this.router.transitionTo('profile.blocked', this.args.user.username);
    }

    @action
    goToFollowers(){
        this.router.transitionTo('profile.followers', this.args.user.username);
    }
}