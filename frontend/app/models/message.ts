import Model, { attr, belongsTo } from "@ember-data/model";
import type UserModel from "./user";
import type ConversationModel from "./conversation";

export default class MessageModel extends Model{
    @attr() declare content :string;
    @attr() declare isRead :boolean;


    @belongsTo('user',{
        async:false,
        inverse:'sentMessages'
    }) declare sender : UserModel;

    @belongsTo('user',{
        async:false,
        inverse:'receivedMessages'
    }) declare receiver : UserModel;

    @belongsTo('conversation',{
        async:false,
        inverse:'messages'
    }) declare conversation : ConversationModel;
}