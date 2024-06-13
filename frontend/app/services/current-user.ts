import Service from "@ember/service";
import type UserModel from "ember-boilerplate/models/user";
import { tracked } from "@glimmer/tracking";
import type Store from "./store";
import { inject as service } from '@ember/service';
import type SessionService from "./session";

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
      this.user = await this.store.findRecord('user',this.id,{include : 'booksToRead,booksInProgress,readBooks,wishList'})
      // let result= await this.store.query('user',{
      //   id : this.id,
      //   include : '*',
      // },) as unknown as UserModel[];
      // this.user = result[0];
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
