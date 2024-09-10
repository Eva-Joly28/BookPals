import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type ConversationModel from "ember-boilerplate/models/conversation";
import type MessageModel from "ember-boilerplate/models/message";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export interface ConversationsSignature {
    Args : {
        conversation : ConversationModel;
        otherUser : UserModel;
        // lastMessage : messageModel;
    }
}

export default class ConversationComponent extends Component<ConversationsSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;

    constructor(owner: unknown, args: ConversationsSignature['Args']){
        super(owner,args);

    }

    get lastUser(){
        if(this.lastMessage!.sender.id === this.currentUser.user!.id){
            return 'vous';
        }
        return this.lastMessage!.sender.username;
    }

    get lastMessage(){
        return  hasManyToArray(this.args.conversation.messages).reverse()[0];
    }

    get otherUser(){
        let other = this.args.conversation.participants.find(u => u.id !== this.currentUser.user!.id);
        return other;
    }

    get extractMessage(){
        if(this.lastMessage!.content.length <= 35) {
            return this.lastMessage!.content;
        }
        let extract = this.lastMessage!.content.slice(0,34);
        extract+='...';
        return extract;
    }

    @action
    goToUser(username : string){
        this.router.transitionTo('profile.index', username);
    }
    

}