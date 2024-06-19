import Model, { attr, belongsTo } from "@ember-data/model";
import type userModel from "./user";
import type BookModel from "./book";

export default class RatingModel extends Model {
    @attr() declare value : number;
    @belongsTo('user',{
        async:false,
        inverse:'ratings'
    }) declare user : userModel;

    @belongsTo('book',{
        async:false,
        inverse:'ratings'
    }) declare book : BookModel;
}