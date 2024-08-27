import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type conversationModel from "ember-boilerplate/models/conversation";
import type messageModel from "ember-boilerplate/models/message";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export interface ConversationsSignature {
    Args : {
        conversation : conversationModel;
        lastMessage : messageModel;
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
        if(this.args.lastMessage.sender.id === this.currentUser.user!.id){
            return 'vous';
        }
        return this.args.lastMessage.sender.username;
    }

    // get message(){
    //     let message = hasManyToArray(this.args.conversation.messages)[0];
    //     return message;
    // }

    get otherUser(){
        let user = this.args.conversation.participants.find(user=>user.id!==this.currentUser.user!.id)
        return user?.username;
    }

    get extractMessage(){
        if(this.args.lastMessage.content.length <= 35) {
            return this.args.lastMessage.content;
        }
        let extract = this.args.lastMessage.content.slice(0,34);
        extract+='...';
        return extract;
    }
    

}