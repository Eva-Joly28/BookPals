import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class CommentLike extends BaseEntity{
  @ManyToOne(() => User, { primary: true})
  user: User;

  @ManyToOne(() => Comment, { primary: true})
  comment: Comment;

  @Property()
  likedAt: Date = new Date();
}