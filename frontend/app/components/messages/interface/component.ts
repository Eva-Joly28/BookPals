import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type ConversationModel from "ember-boilerplate/models/conversation";
import type MessageModel from "ember-boilerplate/models/message";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { updateRecord } from "ember-boilerplate/utils/update-model";
import type SessionService from "ember-simple-auth/services/session";

export interface MessagesSignature {
    Args : {
        messages : MessageModel[];
        conversation? : ConversationModel;
        otherUser: UserModel;
    }
}

export default class MessageComponent extends Component<MessagesSignature>{
    @service declare session : SessionService;
    @service declare store : Store;
    @service declare router : Router;
    @service declare currentUser : CurrentUserService;
    @tracked isCurrentUser = false;
    @tracked isOpen = false;
    @tracked newMessageContent = '';
    @tracked messageTodelete = '';
    @tracked messageToUpdate = '';
    @tracked mode = 'create';
    @tracked messages : MessageModel[] = [];

    constructor(owner: unknown, args: MessagesSignature['Args']){
        super(owner,args);
        this.messages = this.messagesArgs;
        
    }

    get messagesArgs(){
        return this.args.messages;
    }
    
    @action
    goToProfile(username : string){
        this.router.transitionTo('profile', username);
    }

    @action
    switchMode(mode?:string){
        mode? this.mode = mode : this.mode = 'update';
        this.newMessageContent = '';

    }

    @action
    updateMessageContent(event:any) {
        console.log(this.newMessageContent);
        this.newMessageContent = event.target.value;
    }

    @action
    onClose(){
        this.isOpen = false;
    }

    @action
    openModal(id : string){
        this.isOpen = true;
        console.log(this.isOpen);
        this.messageTodelete = id;
        this.switchMode('create');
        this.newMessageContent = '';
    }

    @action
    async deleteMessage(){
        let message = await this.store.peekRecord('message',this.messageTodelete);
        await message.destroyRecord();
        message.unloadRecord();
        this.messages = this.messages.filter(m=>{m.id !== this.messageTodelete});
        this.isOpen = false;
        // await this.args.conversation!.messages.reload();
        // await this.args.conversation.messages.reload();
    }

    @action
    async sendMessage(){
        if(this.newMessageContent.length){
            if(this.mode==='create'){
                let message = this.store.createRecord('message', {
                    content : this.newMessageContent,
                    sender : this.currentUser.user,
                    receiver : this.args.otherUser
                })
                let sentMessage = await message.save();
                this.newMessageContent = '';
                // this.args.messages = [...this.args.messages, message]
                this.args.messages.push(message);
                this.router.transitionTo('profile.messages.conv', sentMessage.conversation.id);
                // this.messages = [...this.messages, message]
                // await this.args.conversation?.messages.reload();
                // await this.args.conversation!.reload();

                // if(this.args.conversation){
                //     await this.args.conversation.reload();
                // }
            }
            else{
                let message = await this.store.findRecord('message',this.messageToUpdate);
                if(this.newMessageContent!==message.content){
                    message.content = this.newMessageContent;
                    let data = {
                        "data": {
                            "id": `${message.id}`,
                            "type": "messages",
                            "attributes": {
                                "content": this.newMessageContent
                            }
                        }
                    }
                    await updateRecord('messages',message.id,data);
                    this.newMessageContent = '';
                    message.reload();

                }
            }
        }
    }

    @action
    async updateMessage(message : any){
        this.switchMode();
        this.newMessageContent = message.content;
        this.messageToUpdate = message.id;
    }

}