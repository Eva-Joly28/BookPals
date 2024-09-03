import Service from "@ember/service";
import type UserModel from "ember-boilerplate/models/user";
import { tracked } from "@glimmer/tracking";
import type Store from "./store";
import { inject as service } from '@ember/service';
import type SessionService from "./session";
import config from "ember-boilerplate/config/environment";

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
  
      this.user = await this.store.findRecord('user',this.id);
      // eslint-disable-next-line ember/classic-decorator-no-classic-methods
      this.set('user', this.user);
    }
    else{
      this.user = undefined;
    }

  }

}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUserService;
  }
}
