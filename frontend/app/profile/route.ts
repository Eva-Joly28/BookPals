import Route from "@ember/routing/route";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export default class Profile extends Route {
    @service declare router : Router;
    @service declare store : Store;
    @service declare currentUser : CurrentUserService;
    @service declare session : SessionService;
    // @tracked isBlocked = false;

    async beforeModel(transition:any) {
      let username = transition.to.params.username;
      let userProfile = await this.store.findRecord('user',username) as unknown as userModel;
      if(userProfile.blockedUsers.includes(this.currentUser.user!)){
        // this.isBlocked = true;
        this.router.transitionTo('profile', username);
      }
      else{
        return super.beforeModel(transition);
      }
    }

    async model(params :any){
      try{
          const username = params.username as string;
          let isBlocked = false;
          let user = await this.store.findRecord('user',username) as unknown as userModel;
          if(user.blockedUsers.includes(this.currentUser.user!)){
            isBlocked = true;
          }
          return {user,isBlocked};
        }
      catch(e){
          console.log(e);
          this.router.transitionTo('404');
        }
  }
    

}