import { action } from "@ember/object";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type ConversationModel from "ember-boilerplate/models/conversation";
import type MessageModel from "ember-boilerplate/models/message";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type SessionService from "ember-simple-auth/services/session";

export default class ProfileNewMessages extends Route{
    @service declare store : Store;
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;
    @service declare router : Router;

    async model(params:any){
        try{
            const parentParams = this.paramsFor('profile');
            const username = parentParams['username'] as string;
            let user = await this.store.findRecord('user',username) as unknown as UserModel;
            await user.conversations.reload();
            if(!this.session.isAuthenticated ){
                this.router.transitionTo('index')
            }
            else{
                if(this.currentUser.user!.username !== username){
                    console.log(username);
                    this.router.transitionTo('profile.index', username);
                }
            }
            let convs = await this.store.query('conversation',{user:user.id}) as unknown as ConversationModel[] || [];
            let conversations = convs ? convs : [];
            let otherUsername = '';
            let otherUser : UserModel ;
            if(params.receiver){
                otherUsername = params.receiver;
                otherUser = await this.store.findRecord('user',otherUsername) as unknown as UserModel;
                let conversation = conversations.find((c)=>{
                c.participants.includes(otherUser)
                })
                if(conversation){
                    this.router.transitionTo('profile.messages.conv', conversation.id);
                }
            }
            else{
                this.router.transitionTo('profile',username);
            }
            otherUser = await this.store.findRecord('user',otherUsername) as unknown as UserModel;
            // let actualConversation = conversations.find((c)=>c.id === otherUsername);
            // let otherId =  actualConversation!.participants.find(u=>u.id !== user.id)!.id
            let messages : MessageModel[] = [];
            
            return {conversations,messages,otherUser};
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }

    @action
    click(){}
}