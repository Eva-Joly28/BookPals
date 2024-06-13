import { Book } from "src/database/entities/Book";
import { Comment } from "src/database/entities/Comment";
import { List } from "src/database/entities/List";
import { Rating } from "src/database/entities/Rating";
import { User } from "src/database/entities/User";

export default class JsonApiSerializer {
    static serializeBook(book: Book) {

      return {
        data: {
          type: 'books',
          id: book.id,
          attributes: {
            bookId: book.bookId,
            title: book.title,
            authors: book.authors,
            publishedDate: book.publishedDate,
            publisher: book.publisher,
            description: book.description,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            pageCount: book.pageCount,
            defaultImage: book.defaultImage,
            cover: book.cover,
            categories: book.categories,
            snippet: book.snippet,
            language: book.language,
            views: book.views,
            rate: book.rate,
          },
          relationships: {
            usersWishlists: {
              data: book.usersWishlists?.map(user => ({
                type: 'users',
                id: user.id,
              })) || [],
            },
            usersToRead: {
              data: book.usersToRead?.map(user => ({
                type: 'users',
                id: user.id,
              })) || [],
            },
            usersInProgress: {
              data: book.usersInProgress?.map(user => ({
                type: 'users',
                id: user.id,
              })) || [],
            },
            usersReadBooks: {
              data: book.usersReadBooks?.map(user => ({
                type: 'users',
                id: user.id,
              })) || [],
            },
            lists: {
              data: book.lists?.map(list => ({
                type: 'lists',
                id: list.id,
              })) || [],
            },
            comments: {
              data: book.comments?.map(comment => ({
                type: 'comments',
                id: comment.id,
              })) || [],
            },
            ratings: {
              data: book.ratings?.map(rating => ({
                type: 'ratings',
                id: rating.id,
              })) || [],
            },
          },
        },
      };
    }
  
    static serializeBooks(books: Book[]) {
      return {
        data: books.map(book => this.serializeBook(book).data),
      };
    }

    static serializeUser(user: User) {
        return {
          data: {
            type: 'users',
            id: user.id,
            attributes: {
              email: user.email,
              username: user.username,
              role: user.role,
              status: user.status,
              isVerified: user.isVerified,
              verificationToken: user.verificationToken,
              refreshToken: user.refreshToken,
              profilePicture: user.profilePicture,
            },
            relationships: {
              booksToRead: {
                data: user.booksToRead? user.booksToRead?.map(book => ({
                  type: 'books',
                  id: book.id,
                })) : [],
              },
              booksInProgress: {
                data: user.booksInProgress? user.booksInProgress.map(book => ({
                  type: 'books',
                  id: book.id,
                })) : [],
              },
              readBooks: {
                data: user.readBooks? user.readBooks.map(book => ({
                  type: 'books',
                  id: book.id,
                })) : [],
              },
              wishList: {
                data: user.wishList? user.wishList.map(book => ({
                  type: 'books',
                  id: book.id,
                })) : [],
              },
              ratings: {
                data: user.ratings? user.ratings.map(rating => ({
                  type: 'ratings',
                  id: rating.id,
                })) : [],
              },
              comments: {
                data: user.comments? user.comments.map(comment => ({
                  type: 'comments',
                  id: comment.id,
                })) : [],
              },
              likedComments: {
                data: user.likedComments? user.likedComments.map(comment => ({
                  type: 'comments',
                  id: comment.id,
                })) : [],
              },
              favoritesLists: {
                data: user.favoritesLists? user.favoritesLists.map(list => ({
                  type: 'lists',
                  id: list.id,
                })) : [],
              },
              usersLists: {
                data: user.usersLists? user.usersLists.map(list => ({
                  type: 'lists',
                  id: list.id,
                })) : [],
              },
            },
          },
        };
    }
    
    static serializeUsers(users: User[]) {
        return {
            data: users.map(user => this.serializeUser(user).data),
        };
    }
    
    static serializeList(list: List) {
        return {
          data: {
            type: 'lists',
            id: list.id,
            attributes: {
              name: list.name,
              description: list.description,
              status: list.status,
              keyWords: list.keyWords,
            },
            relationships: {
              likedBy: {
                data: list.likedBy?.map(user => ({
                  type: 'users',
                  id: user.id,
                })) || [],
              },
              books: {
                data: list.books?.map(book => ({
                  type: 'books',
                  id: book.id,
                })) || [],
              },
              creator: {
                data: list.creator ? {
                  type: 'users',
                  id: list.creator.id,
                } : null,
              },
            },
          },
        };
      }
    
    static serializeLists(lists: List[]) {
        return {
          data: lists.map(list => this.serializeList(list).data),
        };
    }

    static serializeComment(comment: Comment) {
        return {
          data: {
            type: 'comments',
            id: comment.id,
            attributes: {
              comment: comment.comment,
              likedAt: comment.likedAt,
            },
            relationships: {
              book: {
                data: {
                  type: 'books',
                  id: comment.book.id,
                },
              },
              user: {
                data: {
                  type: 'users',
                  id: comment.user.id,
                },
              },
              likedBy: {
                data: comment.likedBy?.map(user => ({
                  type: 'users',
                  id: user.id,
                })) || [],
              },
            },
          },
        };
      }
    
    static serializeComments(comments: Comment[]) {
        return {
            data: comments.map(comment => this.serializeComment(comment).data),
        };
    }

    static serializeRating(rating: Rating) {
        return {
          data: {
            type: 'ratings',
            id: rating.id,
            attributes: {
              value: rating.value,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: rating.user.id,
                },
              },
              book: {
                data: {
                  type: 'books',
                  id: rating.book.id,
                },
              },
            },
          },
        };
      }
    
      static serializeRatings(ratings: Rating[]) {
        return {
          data: ratings.map(rating => this.serializeRating(rating).data),
        };
      }

    
}