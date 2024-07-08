import Model, { attr, hasMany, type AsyncHasMany, type SyncHasMany } from "@ember-data/model";
import type userModel from "./user";
import type commentModel from "./comment";
import type RatingModel from "./rating";

export default class BookModel extends Model {
    @attr() declare bookId: string;
    @attr() declare title : string;
    @attr() declare description : string;
    @attr() declare isbn10 : string;
    @attr() declare isbn13 : string;
    @attr() declare authors : string[];
    @attr() declare publishedDate : string;
    @attr() declare publisher : string;
    @attr() declare categories : string[];
    @attr() declare language : string;
    @attr() declare cover : string;
    @attr() declare defaultImage : string;
    @attr() declare views: number;
    @attr() declare rate: number;
    @attr() declare pageCount: number;
    @attr() declare snippet: string;
    
    @hasMany('user', {
        async:false,
        inverse: 'booksToRead',
    })
    declare usersToRead: SyncHasMany<userModel>

    @hasMany('user', {
        async:false,
        inverse: 'readBooks',
    })
    declare usersReadBooks: SyncHasMany<userModel>

    @hasMany('user', {
        async:false,
        inverse: 'booksInProgress',
    })
    declare usersInProgress: SyncHasMany<userModel>

    @hasMany('user', {
        async:false,
        inverse: 'wishList',
    })
    declare usersWishLists: SyncHasMany<userModel>

    @hasMany('comment', {
        async:false,
        inverse: 'book',
    })
    declare comments: SyncHasMany<commentModel>

    @hasMany('rating', {
        async:false,
        inverse: 'book',
    })
    declare ratings: SyncHasMany<RatingModel>

}