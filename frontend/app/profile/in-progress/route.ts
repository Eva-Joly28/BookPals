import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type Store from "ember-boilerplate/services/store";

export default class ProfileInProgress extends Route{
    @service declare router : Router;
    @service declare store : Store

    async model(){
        try{
            const parentParams = this.paramsFor('profile');
            const username = parentParams['username'] as string;
            return await this.store.findRecord('user',username) as unknown as userModel;
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}