import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { MaxLength } from "class-validator";
import { User } from "./User";

@Entity()
export class List extends BaseEntity{
    @Property()
    declare name: string;

    @Property()
    @MaxLength(200)
    declare description?: string;

    @Property()
    declare books: string[]

    @Property()
    declare status: boolean //false for public and true for private

    @Property()
    declare keyWords: string[]

    @ManyToMany(() => User, "favoritesLists", )
    declare likedBy: User[];

    @ManyToOne('User')
    declare creator: User;

}