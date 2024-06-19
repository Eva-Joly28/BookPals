import Service from "@ember/service";
import type UserModel from "ember-boilerplate/models/user";
import { tracked } from "@glimmer/tracking";
import type Store from "./store";
import { inject as service } from '@ember/service';
import type SessionService from "./session";
import config from "ember-boilerplate/config/environment";
import UserSerializer from "ember-boilerplate/serializers/user";

export default class CurrentUserService extends Service {
  @service declare session: SessionService;
  @service declare store: Store;
  @tracked public user?: UserModel;
  @tracked public id? = '';

  constructor() {
    super(...arguments);
    this.load();
  }

  async load() {
    this.id = this.session.data.authenticated.id;
    if(this.id) {
        let response = await fetch(`${config.host}/${config.namespace}/users/${this.id}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      })
    
      this.user = await response.json() as unknown as UserModel;
      // this.user = await this.store.findRecord('user',this.id,{include : 'booksToRead,booksInProgress,readBooks,wishList,comments,likedComments,ratings,following,followers'})
      console.log(this.user);
      // eslint-disable-next-line ember/classic-decorator-no-classic-methods
      this.set('user', this.user);
    }
    else{
      this.user = undefined;
    }

    // if (this.session.isAuthenticated) {
    //   try {
    //     this.user = await this.store.findRecord('user', this.id!.toString());
    //     console.log(this.user);
    //   } catch (error) {
    //     console.error('Failed to load user:', error);
    //     this.user = undefined;
    //   }
    // } 
  }

}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUserService;
  }
}
