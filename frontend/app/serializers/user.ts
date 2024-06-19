import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';
import {Snapshot} from '@ember-data/store';
import type BookModel from 'ember-boilerplate/models/book';
import type userModel from 'ember-boilerplate/models/user';

export default class UserSerializer extends JSONSerializer {
  normalize(typeClass: any, hash: any) {
    if (hash.booksToRead) {
      hash.booksToRead = hash.booksToRead.map((bookId: string) => ({ id: bookId, type: 'book' }));
    }

    if (hash.readBooks) {
      hash.readBooks = hash.readBooks.map((bookId: string) => ({ id: bookId, type: 'book' }));
    }

    if (hash.booksInProgress) {
      hash.booksInProgress = hash.booksInProgress.map((bookId: string) => ({ id: bookId, type: 'book' }));
    }

    if (hash.following) {
      hash.following = hash.following.map((userId: string) => ({ id: userId, type: 'user' }));
    }

    if (hash.followers) {
      hash.followers = hash.followers.map((userId: string) => ({ id: userId, type: 'user' }));
    }

    if (hash.wishList) {
      hash.wishList = hash.wishList.map((bookId: string) => ({ id: bookId, type: 'book' }));
    }

    if (hash.comments) {
      hash.comments = hash.comments.map((commentId: string) => ({ id: commentId, type: 'comment' }));
    }

    if (hash.likedComments) {
      hash.likedComments = hash.likedComments.map((commentLikeId: string) => ({ id: commentLikeId, type: 'comment-like' }));
    }

    if (hash.ratings) {
      hash.ratings = hash.ratings.map((ratingId: string) => ({ id: ratingId, type: 'rating' }));
    }

    return super.normalize(typeClass, hash);
  }

//   serialize(snapshot: Snapshot, options: any) {
//     let json: any = super.serialize(snapshot, options);

//     // Ensure relationships are properly serialized
//     if (snapshot.hasMany('booksToRead')) {
//       json.data.relationships.booksToRead = {
//         data: snapshot.hasMany('booksToRead')!.map((bookSnapshot: Snapshot) => ({ id: bookSnapshot.id, type: 'book' }))
//       };
//     }

//     if (snapshot.hasMany('readBooks')) {
//       json.data.relationships.readBooks = {
//         data: snapshot.hasMany('readBooks')!.map((bookSnapshot: Snapshot) => ({ id: bookSnapshot.id, type: 'book' }))
//       };
//     }

//     if (snapshot.hasMany('booksInProgress')) {
//       json.data.relationships.booksInProgress = {
//         data: snapshot.hasMany('booksInProgress')!.map((bookSnapshot: Snapshot) => ({ id: bookSnapshot.id, type: 'book' }))
//       };
//     }

//     if (snapshot.hasMany('following')) {
//       json.data.relationships.following = {
//         data: snapshot.hasMany('following')!.map((userSnapshot: Snapshot) => ({ id: userSnapshot.id, type: 'user' }))
//       };
//     }

//     if (snapshot.hasMany('followers')) {
//       json.data.relationships.followers = {
//         data: snapshot.hasMany('followers')!.map((userSnapshot: Snapshot) => ({ id: userSnapshot.id, type: 'user' }))
//       };
//     }

//     if (snapshot.hasMany('wishList')) {
//       json.data.relationships.wishList = {
//         data: snapshot.hasMany('wishList')!.map((bookSnapshot: Snapshot) => ({ id: bookSnapshot.id, type: 'book' }))
//       };
//     }

//     if (snapshot.hasMany('comments')) {
//       json.data.relationships.comments = {
//         data: snapshot.hasMany('comments')!.map((commentSnapshot: Snapshot) => ({ id: commentSnapshot.id, type: 'comment' }))
//       };
//     }

//     if (snapshot.hasMany('likedComments')) {
//       json.data.relationships.likedComments = {
//         data: snapshot.hasMany('likedComments')!.map((commentLikeSnapshot: Snapshot) => ({ id: commentLikeSnapshot.id, type: 'comment-like' }))
//       };
//     }

//     if (snapshot.hasMany('ratings')) {
//       json.data.relationships.ratings = {
//         data: snapshot.hasMany('ratings')!.map((ratingSnapshot: Snapshot) => ({ id: ratingSnapshot.id, type: 'rating' }))
//       };
//     }

//     return json;
//   }
}
