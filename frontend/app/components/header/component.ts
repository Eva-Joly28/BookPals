import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

interface HeaderSignature{
    Args:{

    }
}

export default class HeaderComponent extends Component<HeaderSignature>{
    @service declare router: Router;
    @service declare store : Store
    @tracked showLogin = false;
    @tracked isOpenModal = false;
    @tracked isIndex : boolean = true;
    @tracked searchValue = '';
    @service declare session : SessionService;
    @service('current-user') declare currentUser : CurrentUserService;
    declare currentRoute : string|null;
    constructor(owner : unknown, args: HeaderSignature['Args']) {
        super(owner,args);
        this.currentRoute = this.router.currentRouteName;
        this.isIndex = this.currentRoute === 'index'? true : false;
        this.router.on('routeDidChange', () => {
            this.currentRoute = this.router.currentRouteName;
            this.isIndex = this.currentRoute === 'index'? true : false;
        })

    }

    @action
    backHome(){
        this.router.transitionTo('index');
    }

    @action
    search(e: any){
        if(e.key === 'Enter'){
            this.searchValue = e.target.value;
            console.log(this.searchValue);
            this.router.transitionTo('search', this.searchValue.replaceAll(' ','-'));
        }
    }


    @action
    updateValue(e: InputEvent){
        this.searchValue = e.data ? e.data : '';
        console.log(this.searchValue);
    }

    @action
    async openModal(){
        this.isOpenModal = true;
    }

    @action
    onCloseModal(){
        this.isOpenModal = false;
    }

    @action
    openLogin(){
        this.showLogin = true; 
    }

    @action
    closeLogin(){
        this.showLogin = false;
    }

}