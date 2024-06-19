import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';
import type { Snapshot } from '@ember-data/store';

export default class CommentLikeSerializer extends JSONSerializer {
  normalize(typeClass: any, hash: any) {
    if (hash.user) {
      hash.user = { id: hash.user, type: 'user' };
    }

    if (hash.comment) {
      hash.comment = { id: hash.comment, type: 'comment' };
    }

    return super.normalize(typeClass, hash);
  }
}