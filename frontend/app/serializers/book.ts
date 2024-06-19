// app/serializers/book.ts
import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';

import type { Snapshot } from '@ember-data/store';
import type Store from 'ember-boilerplate/services/store';

export default class BookSerializer extends JSONSerializer {
  normalize(typeClass: any, hash: any) {
    let included: any[] = [];
    if (hash.usersToRead) {
      hash.usersToRead = hash.usersToRead.map((user: any) => {
        included.push({ type: 'user', id: user.id, attributes: user });
        return { id: user.id, type: 'user' };
      });
    }

    if (hash.usersReadBooks) {
      hash.usersReadBooks = hash.usersReadBooks.map((user: any) => {
        included.push({ type: 'user', id: user.id, attributes: user });
        return { id: user.id, type: 'user' };
      });
    }

    if (hash.usersInProgress) {
      hash.usersInProgress = hash.usersInProgress.map((user: any) => {
        included.push({ type: 'user', id: user.id, attributes: user });
        return { id: user.id, type: 'user' };
      });
    }

    if (hash.usersWishLists) {
      hash.usersWishLists = hash.usersWishLists.map((user: any) => {
        included.push({ type: 'user', id: user.id, attributes: user });
        return { id: user.id, type: 'user' };
      });
    }

    if (hash.comments) {
      hash.comments = hash.comments.map((comment: any) => {
        included.push({ type: 'comment', id: comment.id, attributes: comment });
        return { id: comment.id, type: 'comment' };
      });
    }

    if (hash.ratings) {
      hash.ratings = hash.ratings.map((rating: any) => {
        included.push({ type: 'rating', id: rating.id, attributes: rating });
        return { id: rating.id, type: 'rating' };
      });
    }

    // hash.push({included : included})

    return super.normalize(typeClass, hash);
  }

  
}
