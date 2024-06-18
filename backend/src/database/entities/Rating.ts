import { Cascade, Entity, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.js";
import { Book } from "./Book";

@Entity()
export class Rating extends BaseEntity{

    @Property()
    declare value : number;

    @ManyToOne({
        entity: 'User',
        nullable:false,
        cascade:[Cascade.ALL],
    })
    declare user: User;

    @ManyToOne(()=> Book,{cascade:[Cascade.ALL]})
    declare book: Book;
}