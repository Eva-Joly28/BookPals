import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { MaxLength } from "class-validator";
import { User } from "./User.js";
import { Book } from "./Book";

@Entity()
export class List extends BaseEntity{
    @Property()
    declare name: string;

    @Property()
    @MaxLength(200)
    declare description?: string;

    @Property()
    declare status: boolean //false for public and true for private
    
    @Property()
    declare keyWords: string[]
    
    @ManyToMany(() => User, "favoritesLists", )
    declare likedBy: User[];

    @ManyToMany(()=>Book,'lists',{owner:true})
    declare books : Book[];
    
    @ManyToOne('User')
    declare creator: User;
    
}