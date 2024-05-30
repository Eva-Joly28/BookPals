import { Entity, Enum, ManyToMany, OneToMany, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

import { IsAlpha, IsAlphanumeric, IsEmail, MinLength } from 'class-validator';
import { Rating } from './Rating.js';
import { Comment } from './Comment.js';
import { List } from './List.js';
import { Roles } from '../../utils/users.roles.js';
import { Book } from './Book';


@Entity()
export class User extends BaseEntity {

  @Property({ nullable: true, hidden: true })
  @MinLength(8)
  password: string;

  @Property({ nullable: false })
  @Unique()
  @IsEmail()
  email: string;

  @Property()
  @IsAlphanumeric()
  declare username: string;

  @Property({default:Roles.User})
  declare role: Roles;

  @Property({default:0})
  declare status: number;
  
  @ManyToMany(()=>Book,'usersToRead',{owner:true})
  declare booksToRead: string[];

  @ManyToMany(()=>Book,'usersInProgress',{owner:true})
  declare booksInProgress: string[];

  @ManyToMany(() => Book,'usersWishists',{owner:true})
  declare wishList: string[]; 

  @OneToMany(() => Rating, rating=> rating.user)
  declare ratings : Rating[];

  @OneToMany(() => Comment, comments=> comments.user)
  declare comments : Comment[];

  @ManyToMany(() => List,'likedBy',{owner:true})
  declare favoritesLists : List[];

  @OneToMany(()=> List, list => list.creator)
  declare usersLists: List[];


  constructor() {
    super();
  }
}


