import Model, { attr, hasMany, type AsyncHasMany, type SyncHasMany } from "@ember-data/model";
import type UserModel from "./user";
import type CommentModel from "./comment";
import type RatingModel from "./rating";
import type listModel from "./list";

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
    declare usersToRead: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'readBooks',
    })
    declare usersReadBooks: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'booksInProgress',
    })
    declare usersInProgress: SyncHasMany<UserModel>

    @hasMany('user', {
        async:false,
        inverse: 'wishList',
    })
    declare usersWishLists: SyncHasMany<UserModel>

    @hasMany('comment', {
        async:false,
        inverse: 'book',
    })
    declare comments: SyncHasMany<CommentModel>

    @hasMany('rating', {
        async:false,
        inverse: 'book',
    })
    declare ratings: SyncHasMany<RatingModel>

    @hasMany('list',{
        async:false,
        inverse:'books'
    }) declare lists : SyncHasMany<listModel>;

}