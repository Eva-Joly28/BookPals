import Model, { attr, hasMany, type SyncHasMany } from "@ember-data/model";
import type BookModel from "./book";

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

    @hasMany('book', {
        async:false,
        inverse: 'usersWishLists',
    })
    declare wishList: SyncHasMany<BookModel>
}