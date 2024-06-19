import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';
import type { Snapshot } from '@ember-data/store';

export default class CommentSerializer extends JSONSerializer {
  normalize(typeClass: any, hash: any) {
    if (hash.book) {
      hash.book = { id: hash.book, type: 'book' };
    }

    if (hash.user) {
      hash.user = { id: hash.user, type: 'user' };
    }

    if (hash.likedBy) {
      hash.likedBy = hash.likedBy.map((likeId: string) => ({ id: likeId, type: 'comment-like' }));
    }

    return super.normalize(typeClass, hash);
  }
}

declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    comment: CommentSerializer;
  }
}