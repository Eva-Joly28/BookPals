import Model, { attr, hasMany, type SyncHasMany } from "@ember-data/model";
import type BookModel from "./book";
import type commentLikeModel from "./comment-like";
import type RatingModel from "./rating";
import type commentModel from "./comment";

export default class userModel extends Model {
    @attr() declare username : string;
    @attr() declare password : string;
    @attr() declare email : string;
    @attr() declare role : string;
    @attr() declare profilePicture : string;

    @hasMany('book', {
        async:false,
        inverse: 'usersToRead',
    })
    declare booksToRead: SyncHasMany<BookModel>;

    @hasMany('book', {
        async:false,
        inverse: 'usersReadBooks',
    })
    declare readBooks: SyncHasMany<BookModel>;

    @hasMany('book', {
        async:false,
        inverse: 'usersInProgress',
    })
    declare booksInProgress: SyncHasMany<BookModel>

    @hasMany('user', {
        async:false,
        inverse: 'followers',
    })
    declare following: SyncHasMany<userModel>

    @hasMany('user', {
        async:false,
        inverse: 'following',
    })
    declare followers: SyncHasMany<userModel>

    @hasMany('book', {
        async:false,
        inverse: 'usersWishLists',
    })
    declare wishList: SyncHasMany<BookModel>

    @hasMany('comment', {
        async:false,
        inverse: 'user',
    })
    declare comments: SyncHasMany<commentModel>

    @hasMany('comment-like', {
        async:false,
        inverse: 'user',
    })
    declare likedComments: SyncHasMany<commentLikeModel>

    @hasMany('rating', {
        async:false,
        inverse: 'user',
    })
    declare ratings: SyncHasMany<RatingModel>;
}