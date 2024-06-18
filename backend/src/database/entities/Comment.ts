import { Cascade, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Max, MaxLength, max } from "class-validator";
import { User } from "./User.js";
import { Book } from "./Book";
import { CommentLike } from "./CommentLike";

@Entity()
export class Comment extends BaseEntity {

    @Property({length:1500})
    @MaxLength(1500)
    declare comment : string;

    @ManyToOne(()=>Book)
    declare book: Book;

    @ManyToOne({
        entity : 'User',
        nullable:false,
    })
    declare user : User;

    @OneToMany(() => CommentLike, commentLike => commentLike.comment, {cascade:[Cascade.ALL]})
    declare likedBy : CommentLike[];
}