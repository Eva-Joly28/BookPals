import { Cascade, Entity, Enum, ManyToMany, OneToMany, Property, Unique } from '@mikro-orm/core';

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
  @Unique()
  @IsAlphanumeric()
  declare username: string;

  @Property({default:Roles.User})
  declare role: Roles;

  @Property({default:0})
  declare status: number;

  @Property({default:true})
  declare isVerified: boolean;

  @Property({default:''})
  declare verificationToken : string;

  @Property()
  declare refreshToken?:string;

  @Property({nullable:true})
  declare profilePicture:string;
  
  @ManyToMany(()=>Book,'usersToRead',{owner:true, cascade:[Cascade.ALL]})
  declare booksToRead: Book[];

  @ManyToMany(()=>Book,'usersInProgress',{owner:true, cascade:[Cascade.ALL]})
  declare booksInProgress: Book[];

  @ManyToMany(()=>Book,'usersReadBooks',{owner:true, cascade:[Cascade.ALL]})
  declare readBooks: Book[];

  @ManyToMany(() => Book,'usersWishlists',{owner:true, cascade:[Cascade.ALL]})
  declare wishList: Book[]; 

  @OneToMany(() => Rating, rating=> rating.user)
  declare ratings : Rating[];

  @OneToMany(() => Comment, comments=> comments.user)
  declare comments : Comment[];

  @ManyToMany(() => Comment,'likedBy')
  declare likedComments: Comment[];

  @ManyToMany(() => List,'likedBy')
  declare favoritesLists : List[];

  @OneToMany(()=> List, list => list.creator)
  declare usersLists: List[];


  constructor() {
    super();
  }
}


