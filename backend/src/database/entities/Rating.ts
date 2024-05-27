import { Cascade, Entity, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Rating extends BaseEntity{

    @Property()
    declare isbn : string

    @Property()
    declare value : number;

    @ManyToOne({
        entity: 'User',
        nullable:false,
    })
    declare user: User;
}