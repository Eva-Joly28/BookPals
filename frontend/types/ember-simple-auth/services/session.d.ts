import Service from '@ember/service';

import type Transition from '@ember/routing/transition';
import type Store from '@ember-data/store';
import type { Promisable } from 'type-fest';

declare module 'ember-simple-auth/services/session' {
  export default class SessionService extends Service {
    isAuthenticated: boolean;
    data: {
      authenticated: {
        accessToken: string;
        refreshToken: string;
        id : string;
      };
    };
    store: Store;
    setup(): Promisable<void>;
    authenticate(...args: unknown[]): Promise<void>;
    invalidate(): Promise<void>;
    requireAuthentication(
      transition: Transition,
      routeOrCallback: string | Function
    ): boolean;
    prohibitAuthentication(routeOrCallback: string | Function): boolean;
    handleAuthentication(routeAfterAuthentication: string): void;
    handleInvalidation(routeAfterInvalidation: string): void;
  }
}
