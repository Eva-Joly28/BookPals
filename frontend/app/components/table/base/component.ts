import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import { updateFollowing } from "ember-boilerplate/utils/updating-collections";
import type SessionService from "ember-simple-auth/services/session";

export interface TableBaseSignature {
    Args:{
        users: UserModel[]
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableBaseComponent extends Component<TableBaseSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked iconAction = '/assets/icon/plus.svg'

    constructor(owner: unknown, args: TableBaseSignature['Args']){
        super(owner,args);
    
    }

    get following(){
        return this.currentUser.user?.following
    }

    background(user : any){
        if(this.currentUser.user!.following.includes(user)){
            return 'bg-red-400'
        }
        else{
            return 'bg-green-400'
        }
    }

    @action
    goToUser(user : any){
        this.router.transitionTo('profile', user.username);
    }

    @action
    async followUser(user : any){
        await updateFollowing(user, 'push', this.currentUser.user!);
        await user.reload();
    }
}