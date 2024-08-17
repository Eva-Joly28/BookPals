import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type Store from "ember-boilerplate/services/store";

export default class ProfileRead extends Route{
    @service declare store : Store;

    @service declare router : Router;

    async model(){
        try{
            const parentParams = this.paramsFor('profile');
            const username = parentParams['username'] as string;
            let user = await this.store.findRecord('user',username) as unknown as userModel;
            return user;
        }
        catch(e){
            console.log(e);
            this.router.transitionTo('404');
        }
    }
}