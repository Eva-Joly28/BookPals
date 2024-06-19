import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';
import type { Snapshot } from '@ember-data/store';

export default class RatingSerializer extends JSONSerializer {
  normalize(typeClass: any, hash: any) {
    if (hash.user) {
      hash.user = { id: hash.user, type: 'user' };
    }

    if (hash.book) {
      hash.book = { id: hash.book, type: 'book' };
    }

    return super.normalize(typeClass, hash);
  }
}