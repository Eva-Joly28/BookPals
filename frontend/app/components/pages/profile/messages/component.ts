import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type conversationModel from "ember-boilerplate/models/conversation";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileMessagesSignature {
    Args : {
        conversations : conversationModel[];
    }
}

export default class ProfileMessagesComponent extends Component<ProfileMessagesSignature>{
    @service declare session : SessionService;
    @service declare store : Store;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked newMessageContent = '';
    // eslint-disable-next-line ember/no-tracked-properties-from-args
    @tracked selectedConversation : conversationModel;

    constructor(owner: unknown, args: ProfileMessagesSignature['Args']){
        super(owner,args);
        this.selectedConversation = this.args.conversations[0]!;
    }

    @action
    selectConversation(id : string){
        this.selectedConversation = this.args.conversations.find(conversation => conversation.id == id)!;
    }

    @action
    udpdateMessageContent(event:any){
        this.newMessageContent = event.target.value
    }

    @action
    async sendMessage(event:any) {
    event.preventDefault();
    let newMessage = this.store.createRecord('message', {
      content: this.newMessageContent,
      sender: this.currentUser.user,
      receiver: this.selectedConversation.participants.find(p => p.id !== this.currentUser.user!.id),
      conversation: this.selectedConversation,
    });
    await newMessage.save();
    this.selectedConversation.messages.pushObject(newMessage);
    this.newMessageContent = '';
  }

    @action
    async returnLastMessage(id : string){
        // let actualConversation = this.args.conversations.find(conversation => conversation.id == id)!;
        let conv = await  this.store.findRecord('conversation',id);
        return conv.messages[0];
    }

    @action 
    isActive(id : string){
        if(this.selectedConversation.id === id){
            return true
        }
        return false;
    }
    

}