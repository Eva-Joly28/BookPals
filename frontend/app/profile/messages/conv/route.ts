import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type ConversationModel from "ember-boilerplate/models/conversation";
import type MessageModel from "ember-boilerplate/models/message";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export default class ProfileMessages extends Route{
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
                    this.router.transitionTo('profile.index', username);
                }
            }
            let conversations = await this.store.query('conversation',{user:user.id}) as unknown as ConversationModel[];
            let convId = ''
            if(params.id){
                convId = params.id;
            }
            else{
                if(!(conversations.length>0) || !conversations){
                    this.router.transitionTo('profile',username);
                }
                else{
                    convId = conversations[0]!.id;
                }
            }
            let actualConversation = conversations.find((c)=>c.id === convId);
            let otherId =  actualConversation!.participants.find(u=>u.id !== user.id)!.id
            let otherUser = await this.store.findRecord('user',otherId) as unknown as UserModel;
            let messages = await this.store.query('message',{conversation:convId}) as unknown as MessageModel[];
            
            return {conversations,messages,otherUser, actualConversation};
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}