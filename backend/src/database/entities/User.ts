import { Entity, Enum, ManyToMany, OneToMany, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity.js';

import { IsAlpha, IsAlphanumeric, IsEmail, MinLength } from 'class-validator';
import { Rating } from './Rating';
import { Comment } from './Comment';
import { List } from './List';
import { Roles } from '../../utils/users.roles';


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

  @Property()
  declare booksToRead: string[];

  @Property()
  declare booksInProgress: string[];

  @Property()
  declare wishList: string[]; //tableau d'isbn des livres en question

  @Property({default:0})
  declare status: number;

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


