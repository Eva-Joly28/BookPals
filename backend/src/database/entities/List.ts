import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { MaxLength } from "class-validator";
import { User } from "./User.js";
import { Book } from "./Book";

@Entity()
export class List extends BaseEntity{
    @Property({length:1000})
    @MaxLength(1000)
    declare name: string;

    @Property({length:1000})
    @MaxLength(1000)
    declare description?: string;

    @Property()
    declare status: boolean //false for public and true for private
    
    @Property()
    declare keyWords: string[]
    
    @ManyToMany(() => User, "favoritesLists",{owner:true})
    declare likedBy: User[];

    @ManyToMany(()=>Book,'lists',{owner:true})
    declare books : Book[];
    
    @ManyToOne('User')
    declare creator: User;
    
}