import Model, { attr, belongsTo, hasMany, type SyncHasMany } from "@ember-data/model";
import type BookModel from "./book";
import type CommentLikeModel from "./comment-like";
import type RatingModel from "./rating";
import type CommentModel from "./comment";
import type ConversationModel from "./conversation";
import type MessageModel from "./message";
import type listModel from "./list";

export default class UserModel extends Model {
    @attr() declare username : string;
    @attr() declare password : string;
    @attr() declare email : string;
    @attr() declare role : string;
    @attr() declare status : number;
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
    declare following: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'following',
    })
    declare followers: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'blockedBy',
    })
    declare blockedUsers: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'blockedUsers',
    })
    declare blockedBy: SyncHasMany<UserModel>

    @hasMany('book', {
        async:false,
        inverse: 'usersWishLists',
    })
    declare wishList: SyncHasMany<BookModel>

    @hasMany('conversation', {
        async:false,
        inverse: 'participants',
    })
    declare conversations: SyncHasMany<ConversationModel>

    @hasMany('message', {
        async:false,
        inverse: 'sender',
    })
    declare sentMessages: SyncHasMany<MessageModel>

    @hasMany('message', {
        async:false,
        inverse: 'receiver',
    })
    declare receivedMessages: SyncHasMany<MessageModel>

    @hasMany('comment', {
        async:false,
        inverse: 'user',
    })
    declare comments: SyncHasMany<CommentModel>

    @hasMany('comment-like', {
        async:false,
        inverse: 'user',
    })
    declare likedComments: SyncHasMany<CommentLikeModel>

    @hasMany('rating', {
        async:false,
        inverse: 'user',
    })
    declare ratings: SyncHasMany<RatingModel>;

    @hasMany('list',{
        async:false,
        inverse:'creator'
    }) declare usersLists : SyncHasMany<listModel>;

    @hasMany('list',{
        async:false,
        inverse:'likedBy'
    }) declare favoritesLists : SyncHasMany<listModel>;
}