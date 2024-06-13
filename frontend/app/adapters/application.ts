/* eslint-disable ember/use-ember-data-rfc-395-imports */
import { service } from '@ember/service';
import JSONAdapter from '@ember-data/adapter/json-api';
import RESTAdapter from '@ember-data/adapter/rest';


import config from '../config/environment';

import type SessionService from 'ember-boilerplate/services/session';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import type DS from 'ember-data';
import type { ModelSchema } from 'ember-data';
import type RSVP from 'rsvp';

export default class ApplicationAdapter extends JSONAdapter {
  @service declare session: SessionService;
  @service declare flashMessages: FlashMessageService;

  get host() {
    return config.host;
  }
  namespace = config.namespace;

  get headers(): Record<string, string> {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };

    if (this.session.isAuthenticated) {
      headers[
        'Authorization'
      ] = `Bearer ${this.session.data.authenticated.accessToken}`;
    }

    return headers;
  }

  async handleResponse(
    status: number,
    headers: Record<string, unknown>,
    payload: Record<string, unknown>,
    requestData: Record<string, unknown>
  ) {
    if (status === 401 && this.session.isAuthenticated) {
      this.flashMessages.danger(`Unauthorized action`);
      await this.session.invalidate();
    } else {
      if (status > 500) {
        // Internal
        this.flashMessages.danger(`Fatal error : ${payload}`);
      } else if (status > 400) {
        // Bad request
      }
    }

    return super.handleResponse(status, headers, payload, requestData);
  }

  updateRecord<K extends string | number>(store: DS.Store, type: ModelSchema<K>, snapshot: DS.Snapshot<K>): RSVP.Promise<any> {

    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
    let data = this.serialize(snapshot, { includeId: true });

    return this.ajax(url, 'PATCH', { data: data });
  }

  urlForQueryRecord(
    query: Record<string, unknown>,
    modelName: string | number
  ): string {
    const id = query['id'] as string | number;

    delete query['id'];

    return this.buildURL(modelName, id, null, 'findRecord', query);
  }

  // urlForQuery<K extends string | number>(query: any, modelName: K): string {
  //   if(query.url){
  //      const url = `${this.host}/${this.namespace}/books/image-proxy?url=${query.url}`;
  //      return url
  //   }
  //   return super.urlForQuery(query,modelName);
  // }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    application: ApplicationAdapter;
  }
}
