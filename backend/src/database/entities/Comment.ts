import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Max, MaxLength, max } from "class-validator";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {

    @Property()
    declare isbn : string;

    @Property()
    @MaxLength(500)
    declare comment : string;

    @ManyToOne({
        entity : 'User',
        nullable:false,
    })
    declare user : User;
}