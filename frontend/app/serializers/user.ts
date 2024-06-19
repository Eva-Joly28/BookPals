import JSONAPISerializer from '@ember-data/serializer/json-api';
import JSONSerializer from '@ember-data/serializer/json';

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

}
