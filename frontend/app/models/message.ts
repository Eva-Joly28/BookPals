import Model, { attr, belongsTo } from "@ember-data/model";
import type userModel from "./user";
import type conversationModel from "./conversation";

export default class messageModel extends Model{
    @attr() declare content :string;
    @attr() declare isRead :boolean;


    @belongsTo('user',{
        async:false,
        inverse:'sentMessages'
    }) declare sender : userModel;

    @belongsTo('user',{
        async:false,
        inverse:'receivedMessages'
    }) declare receiver : userModel;

    @belongsTo('conversation',{
        async:false,
        inverse:'messages'
    }) declare conversation : conversationModel;
}