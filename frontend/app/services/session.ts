import { service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import type CurrentUserService from './current-user';

export default class SessionService extends BaseSessionService {
  @service declare currentUser: CurrentUserService;
  constructor(){
    super(...arguments);
  }

  async handleAuthentication() {
    try {
      await this.currentUser.load();
      console.log(this.currentUser.get('user'))
    } catch (err) {
      /**
       * Does not invalidate with abord error, loading the current user Jis optional and may be canceled
       * `err instanceof AbortError` is false BTW, we check with the message
       */
      if ((err as Error).message === 'Aborted') {
        return;
      }

      await this.invalidate();
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    session: SessionService;
  }
}
