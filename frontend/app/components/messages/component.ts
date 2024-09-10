import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type MessageModel from "ember-boilerplate/models/message";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface MessagesSignature {
    Args : {
        message : MessageModel;
    }
}

export default class MessageComponent extends Component<MessagesSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked isCurrentUser = false;
    @tracked optionsVisible = false;
    @tracked direction = 'col-start-1 col-end-8 p-3';

    constructor(owner: unknown, args: MessagesSignature['Args']){
        super(owner,args);
        if(this.currentUser.user!.id === this.args.message.sender.id){
            this.isCurrentUser = true;
            this.direction = 'col-start-6 col-end-12 p-3'
        }
    }
    
    @action
    goToProfile(username : string){
        this.router.transitionTo('profile', username);
    }

    @action
    setHover(visible : boolean){
        this.optionsVisible = visible;
    }

}