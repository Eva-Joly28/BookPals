import Model, { attr, belongsTo } from "@ember-data/model";
import type userModel from "./user";
import type commentModel from "./comment";

export default class commentLikeModel extends Model {
    @attr() declare likedAt : string;
    @belongsTo('user') declare user : userModel;
    @belongsTo('comment') declare comment : commentModel;

}