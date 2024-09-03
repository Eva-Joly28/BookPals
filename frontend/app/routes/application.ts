import { makeArray } from '@ember/array';
import { array } from '@ember/helper';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type userModel from 'ember-boilerplate/models/user';
import type Router from 'ember-boilerplate/router';
import type CurrentUserService from 'ember-boilerplate/services/current-user';
import type LoadingService from 'ember-boilerplate/services/load';
import type Store from 'ember-boilerplate/services/store';
import type FlashObject from 'ember-cli-flash/flash/object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import type { IntlService } from 'ember-intl';
import type SessionService from 'ember-simple-auth/services/session';

export default class Application extends Route {
  @service declare session: SessionService;
  @service declare intl: IntlService;
  @service declare  router : Router;
  @service declare store : Store
  @tracked isLoading = false;
  @service declare flashMessages: FlashMessageService;
  @tracked declare flashMessageQueue : FlashObject[];
  @service declare currentUser : CurrentUserService;

  constructor(){
    super(...arguments);
  }

  async beforeModel() {
    this.intl.setLocale(['fr-fr']);
    await this.session.setup();
    if(this.session.isAuthenticated){
      await this.currentUser.load();
    }
    
  }

  // async model(){
  //   // console.log(this.session.data.authenticated);
    
  //   console.log(this.currentUser.user?.username);
  //   let users : userModel[] = makeArray(await this.store.findAll('user')) as unknown as userModel[];
  //   return users
  // }

  @action
  loading(transition:Transition){
    this.isLoading = true;
    transition.finally(()=> {
      this.isLoading = false;
    });
  }
}

