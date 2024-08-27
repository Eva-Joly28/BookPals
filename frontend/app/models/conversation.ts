import Model, { attr, hasMany, type SyncHasMany } from "@ember-data/model";
import type userModel from "./user";
import type messageModel from "./message";

export default class conversationModel extends Model {
    @attr() declare lastMessageDate : string;

    @hasMany('user', {
        async:false,
        inverse: 'conversations'
    })
    declare participants : SyncHasMany<userModel>;

    @hasMany('message',{
        async:false,
        inverse: 'conversation'
    })
    declare messages : SyncHasMany<messageModel>;
}