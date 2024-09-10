import Model, { attr, belongsTo, hasMany, type SyncHasMany } from "@ember-data/model";
import type UserModel from "./user";
import type BookModel from "./book";

export default class ListModel extends Model{
    @attr() declare name : string;
    @attr() declare description : string;
    @attr() declare status : boolean;
    @attr() declare keyWords : string[];

    @hasMany('user',{
        async:false,
        inverse:'favoritesLists'
    }) declare likedBy : SyncHasMany<UserModel>;

    @belongsTo('user',{
        async:false,
        inverse:'usersLists'
    }) declare creator : UserModel;

    @hasMany('book',{
        async:false,
        inverse:'lists'
    }) declare books : SyncHasMany<BookModel>;
}