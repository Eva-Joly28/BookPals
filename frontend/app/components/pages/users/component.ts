import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface PagesUsersSignature {
    Args:{
        model: userModel[]
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PagesUsersComponent extends Component<PagesUsersSignature>{
    @service declare session : SessionService
    @service declare currentUser : CurrentUserService;

    get topUsers(){
        return this.args.model.slice(0,3);
    }

    get followers(){
        return this.currentUser.user?.followers;
    }

    get others(){
        return this.args.model.slice(4,-1);
    }

    @action
    viewMore(){
        console.log('2');
    }


    
}