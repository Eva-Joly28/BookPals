import { Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Conversation extends BaseEntity{
    @Property({type:'timestamp', nullable:true})
    lastMessageDate?: Date;

    @ManyToMany(() => User,'conversations', {owner:true})
    participants : User[];

    @OneToMany(()=> Message, message => message.conversation)
    messages : Message[];
}