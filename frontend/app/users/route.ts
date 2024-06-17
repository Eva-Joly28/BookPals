import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export default class Users extends Route {
    @service declare store : Store;
    @service declare currentUser : CurrentUserService;
    @service declare session : SessionService;

    async model () {
        try{
            let users = this.store.query('user',{orderBy:'status', limit:20})
            return users;
        }   
        catch(e){
            console.log(e);
        }
    }

}