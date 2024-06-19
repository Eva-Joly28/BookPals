import Model, { attr, belongsTo } from "@ember-data/model";
import type userModel from "./user";
import type commentModel from "./comment";

export default class commentLikeModel extends Model {
    @attr() declare likedAt : string;
    @belongsTo('user',{
        async:false,
        inverse:'likedComments'
    }) 
    declare user : userModel;

    @belongsTo('comment',{
        async:false,
        inverse:'likedBy'
    }) 
    declare comment : commentModel;

}