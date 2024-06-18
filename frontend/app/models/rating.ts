import Model, { attr, belongsTo } from "@ember-data/model";
import type userModel from "./user";
import type BookModel from "./book";

export default class RatingModel extends Model {
    @attr() declare value : number;
    @belongsTo('user') declare user : userModel;
    @belongsTo('book') declare book : BookModel;
}