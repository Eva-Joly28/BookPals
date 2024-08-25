import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Conversation } from "./Conversation";

@Entity()
export class Message extends BaseEntity {
    @Property({length:3000})
    declare content : string;

    @Property({default:false})
    isRead: boolean;


    @ManyToOne(()=> User)
    sender: User;

    @ManyToOne(() => Conversation)
    conversation : Conversation;

    @ManyToOne(()=> User)
    receiver: User;

}