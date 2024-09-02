import { Cascade, Entity, ManyToMany, OneToMany, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { IsUrl, isISBN } from "class-validator";
import { User } from "./User";
import { Comment } from "./Comment";
import { Rating } from "./Rating";
import { List } from "./List";
import { BookRepository } from "../../api/repositories/book.repository";


@Entity({ repository: () => BookRepository })
export class Book extends BaseEntity {

    @Property()
    @Unique()
    bookId: string;

    @Property()
    title: string;

    @Property()
    authors: string[];

    @Property()
    publishedDate: string;

    @Property()
    publisher?: string;

    @Property({length:1500})
    description: string;

    @Property()
    isbn10: string;

    @Property()
    isbn13: string;

    @Property()
    pageCount: number;

    @Property()
    @IsUrl()
    defaultImage?: string;

    @Property({length:350})
    @IsUrl()
    cover: string;

    @Property()
    categories: string[];

    @Property({length:350})
    snippet?: string;

    @Property()
    language: string;

    @Property({type:'int8'})
    views: number;


    @ManyToMany(()=>User, 'wishList')
    declare usersWishlists : User[];

    @ManyToMany(()=>User, 'booksToRead')
    declare usersToRead : User[];

    @ManyToMany(()=>User,'booksInProgress')
    declare usersInProgress: User[];

    @ManyToMany(()=>User,'readBooks')
    declare usersReadBooks: User[];

    @ManyToMany(()=>List, 'books')
    declare lists: List[];

    @OneToMany(() => Comment, comment=>comment.book)
    declare comments: Comment[];

    @OneToMany(()=>Rating, rating=>rating.book)
    declare ratings: Rating[]


}