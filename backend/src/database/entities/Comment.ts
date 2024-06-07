import { Cascade, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Max, MaxLength, max } from "class-validator";
import { User } from "./User.js";
import { Book } from "./Book";

@Entity()
export class Comment extends BaseEntity {

    @Property()
    @MaxLength(500)
    declare comment : string;

    @Property()
    declare likedAt : Date;

    @ManyToOne(()=>Book)
    declare book: Book;

    @ManyToOne({
        entity : 'User',
        nullable:false,
    })
    declare user : User;

    @ManyToMany(() => User, "likedComments",{owner:true})
    declare likedBy : User[];
}