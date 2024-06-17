import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export default interface HeaderNavSignature {
    Args : {
        openLogin : Function;
        openModal : Function;
    }
}

export default class HeaderNavComponent extends Component<HeaderNavSignature> {

    @service declare currentUser : CurrentUserService  ; 
    @service declare session : SessionService;
    @service declare router : Router;

    // get user() {
    //     return this.currentUser.user;
    // }

    @action
    gotoUsers(){
        this.router.transitionTo('users');
    }

    // @action
    // logOut(){
    //     this.session.invalidate;
    //     if(this.router.currentURL === null){
    //         this.session.handleInvalidation('index')
    //     }
    //     this.session.handleInvalidation(this.router.currentURL!);
    // }
}