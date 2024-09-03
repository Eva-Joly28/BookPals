import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export default interface HeaderUserSignature {
    Args : {
        
    }
}

export default class HeaderUserComponent extends Component<HeaderUserSignature> {

    @service declare currentUser : CurrentUserService  ; 
    @service declare session : SessionService;
    @service declare router : Router;

    get user() {
        return this.currentUser.user;
    }

    @action
    logOut(){
        this.session.invalidate();
        // if(this.router.currentURL === null){
        //     this.session.handleInvalidation('index')
        // }
        this.session.handleInvalidation(this.router.currentURL!);
        // this.router.transitionTo(this.router.currentURL);
        // window.location.reload();
    }

    @action
    goToProfile(){
        this.router.transitionTo('profile', this.currentUser.user?.username);
    }

    @action
    goToNetwork(){
        this.router.transitionTo('profile.followers', this.currentUser.user?.username);
    }

    @action
    goToRead(){
        this.router.transitionTo('profile.read', this.currentUser.user?.username);
    }

    @action
    goToHome(){
        this.router.transitionTo('index');
    }

    @action
    goToLists(){
        this.router.transitionTo('profile', this.currentUser.user?.username);
    }
}