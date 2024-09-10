import Model, { attr, belongsTo } from "@ember-data/model";
import type UserModel from "./user";
import type CommentModel from "./comment";

export default class CommentLikeModel extends Model {
    @attr() declare likedAt : string;
    @belongsTo('user',{
        async:false,
        inverse:'likedComments'
    }) 
    declare user : UserModel;

    @belongsTo('comment',{
        async:false,
        inverse:'likedBy'
    }) 
    declare comment : CommentModel;

}