import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type Store from "ember-boilerplate/services/store";

export interface usersBaseSignature {
    Args:{
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class UsersBaseComponent extends Component<usersBaseSignature>{
    // @service declare store : Store;
    // @service declare router : Router;

    // @action
    // goToUser(){
    //    if(this.args.user){
    //     this.router.transitionTo('profile',this.args.user.username);
    //     }
    // }
}