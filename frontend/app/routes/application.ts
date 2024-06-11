import { action } from '@ember/object';
import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type Router from 'ember-boilerplate/router';
import type LoadingService from 'ember-boilerplate/services/load';
import type { IntlService } from 'ember-intl';
import type SessionService from 'ember-simple-auth/services/session';

export default class Application extends Route {
  @service declare session: SessionService;
  @service declare intl: IntlService;
  @service declare  router : Router;
  @tracked isLoading = false;

 

  async beforeModel() {
    this.intl.setLocale(['fr-fr']);
    await this.session.setup();
  }

  @action
  loading(transition:Transition){
    this.isLoading = true;
    transition.finally(()=> {
      this.isLoading = false;
    });
  }
}

