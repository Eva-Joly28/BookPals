import Model, { attr, hasMany, type SyncHasMany } from "@ember-data/model";
import type UserModel from "./user";
import type MessageModel from "./message";

export default class ConversationModel extends Model {
    @attr() declare lastMessageDate : string;

    @hasMany('user', {
        async:false,
        inverse: 'conversations'
    })
    declare participants : SyncHasMany<UserModel>;

    @hasMany('message',{
        async:false,
        inverse: 'conversation'
    })
    declare messages : SyncHasMany<MessageModel>;
}