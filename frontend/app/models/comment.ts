import Model, { attr, belongsTo, hasMany, type SyncHasMany } from "@ember-data/model";
import type BookModel from "./book";
import type userModel from "./user";
import type commentLikeModel from "./comment-like";

export default class commentModel extends Model {
    @attr() declare comment : string;
    @belongsTo('book') declare book : BookModel;
    @belongsTo('user') declare user : userModel;
    @hasMany('comment-like',{
        async:false,
        inverse:'comment'
    })
    declare likedBy : SyncHasMany<commentLikeModel>;
}