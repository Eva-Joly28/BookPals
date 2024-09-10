import Model, { attr, belongsTo, hasMany, type SyncHasMany } from "@ember-data/model";
import type BookModel from "./book";
import type UserModel from "./user";
import type CommentLikeModel from "./comment-like";

export default class CommentModel extends Model {
    @attr() declare comment : string;
    @belongsTo('book',{
        async:false,
        inverse:'comments'
    }) 
    declare book : BookModel;

    @belongsTo('user',{
        async:false,
        inverse:'comments'
    }) declare user : UserModel;

    @hasMany('comment-like',{
        async:false,
        inverse:'comment'
    })
    declare likedBy : SyncHasMany<CommentLikeModel>;
}