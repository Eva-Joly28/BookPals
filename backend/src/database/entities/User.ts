import { Cascade, Entity, Enum, ManyToMany, OneToMany, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

import { IsAlpha, IsAlphanumeric, IsEmail, MinLength } from 'class-validator';
import { Rating } from './Rating.js';
import { Comment } from './Comment.js';
import { List } from './List.js';
import { Roles } from '../../utils/users.roles.js';
import { Book } from './Book';
import { CommentLike } from './CommentLike';
import { Message } from './Message';
import { Conversation } from './Conversation';


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
  
  @ManyToMany(()=>Book,'usersToRead',{owner:true})
  declare booksToRead: Book[];

  @ManyToMany(()=>Book,'usersInProgress',{owner:true})
  declare booksInProgress: Book[];

  @ManyToMany(()=>Book,'usersReadBooks',{owner:true})
  declare readBooks: Book[];

  @ManyToMany(() => Book,'usersWishlists',{owner:true})
  declare wishList: Book[]; 

  @ManyToMany(() => User,'followers',{owner:true})
  declare following: User[]; 

  @ManyToMany(() => User,'following')
  declare followers: User[]; 

  @ManyToMany(() => User, 'blockedBy', { owner: true })
  declare blockedUsers : User[];

  @ManyToMany(() => User, 'blockedUsers')
  declare blockedBy : User[];
  
  @OneToMany(() => Rating, rating=> rating.user)
  declare ratings : Rating[];

  @OneToMany(() => Comment, comments=> comments.user)
  declare comments : Comment[];

  @OneToMany(() => CommentLike, commentLike => commentLike.user)
  likedComments: CommentLike[];

  @ManyToMany(()=>Conversation,'participants')
  declare conversations : Conversation[];

  @OneToMany(() => Message, message=> message.sender)
  declare sentMessages : Message[];

  @OneToMany(() => Message, message=> message.receiver)
  declare receivedMessages : Message[];

  @ManyToMany(() => List,'likedBy')
  declare favoritesLists : List[];

  @OneToMany(()=> List, list => list.creator)
  declare usersLists: List[];


  constructor() {
    super();
  }
}


