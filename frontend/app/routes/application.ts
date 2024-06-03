import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import type SessionService from 'ember-simple-auth/services/session';

export default class Application extends Route {
  @service declare session: SessionService;
  @service declare intl: IntlService;

  async beforeModel() {
    this.intl.setLocale(['fr-fr']);
    await this.session.setup();
  }
}
