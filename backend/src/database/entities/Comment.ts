import { Cascade, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Max, MaxLength, max } from "class-validator";
import { User } from "./User.js";
import { Book } from "./Book";
import { CommentLike } from "./CommentLike";
import { CommentRepository } from "../../api/repositories/comment.repository";

@Entity({ repository: () => CommentRepository })
export class Comment extends BaseEntity {

    @Property({length:1500})
    @MaxLength(1500)
    declare comment : string;

    @ManyToOne(()=>Book, {cascade:[Cascade.ALL]})
    declare book: Book;

    @ManyToOne({
        entity : 'User',
        nullable:false,
        cascade:[Cascade.ALL]
    })
    declare user : User;

    @OneToMany(() => CommentLike, commentLike => commentLike.comment, {cascade:[Cascade.ALL]})
    declare likedBy : CommentLike[];
}