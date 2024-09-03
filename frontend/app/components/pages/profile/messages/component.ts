import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type conversationModel from "ember-boilerplate/models/conversation";
import messageModel from "ember-boilerplate/models/message";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import { updateRecord } from "ember-boilerplate/utils/update-model";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileMessagesSignature {
    Args : {
        model : {conversations : conversationModel[], messages: any, otherUser:userModel, actualConversation:conversationModel};
    }
}

export default class ProfileMessagesComponent extends Component<ProfileMessagesSignature>{
    @service declare session : SessionService;
    @service declare store : Store;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked newMessageContent = '';
    // eslint-disable-next-line ember/no-tracked-properties-from-args
    @tracked selectedConversation? : conversationModel;

    constructor(owner: unknown, args: ProfileMessagesSignature['Args']){
        super(owner,args);
        this.selectedConversation = this.args.model.actualConversation ? this.args.model.actualConversation : undefined
        this.readMessages();
    }

    get actualMessages(){
        return hasManyToArray(this.args.model.messages).reverse();
    }

    get lastMessage(){
        return hasManyToArray(this.args.model.messages)[0];
    }


    @action
    selectConversation(id : string){
        this.selectedConversation = this.args.model.conversations.find(conversation => conversation.id == id)!;
        this.router.transitionTo('profile.messages.conv',id);
    }


  readMessages(){
    this.args.model.messages.map((m:any)=>{
        if((!m.isRead)&&(m.receiver.id == this.currentUser.user!.id)){
            let message = this.store.findRecord('message',m.id).then(async(message:any)=>{
                message.isRead = true;
            let data = {
                "data": {
                    "id": `${m.id}`,
                    "type": "messages",
                    "attributes": {
                        "isRead": true
                    }
                }
            }
            await updateRecord('messages',m.id,data);
            });
            
        }
    })
  }

    

}