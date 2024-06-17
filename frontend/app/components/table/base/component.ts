import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface TableBaseSignature {
    Args:{
        users: userModel[]
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableBaseComponent extends Component<TableBaseSignature>{
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;
    @tracked iconAction = '/assets/icon/plus.svg'

    constructor(owner: unknown, args: TableBaseSignature['Args']){
        super(owner,args);
    
    }

    get following(){
        return this.currentUser.user?.following
    }
}