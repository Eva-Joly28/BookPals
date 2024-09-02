import { wrap } from "@mikro-orm/core";
import { Book } from "src/database/entities/Book";
import { Comment } from "src/database/entities/Comment";
import { CommentLike } from "src/database/entities/CommentLike";
import { Conversation } from "src/database/entities/Conversation";
import { List } from "src/database/entities/List";
import { Message } from "src/database/entities/Message";
import { Rating } from "src/database/entities/Rating";
import { User } from "src/database/entities/User";

export default class JsonApiSerializer {
    static serializeBook(book: Book, included = new Set()) {
      const includedData : any = []
      if (!included.has(book.id)) {
        included.add(book.id);
        includedData.push(...(book.usersWishlists || []).map(user => this.serializeUser(user, included).data));
        includedData.push(...(book.usersToRead || []).map(user => this.serializeUser(user, included).data));
        includedData.push(...(book.usersInProgress || []).map(user => this.serializeUser(user, included).data));
        includedData.push(...(book.usersReadBooks || []).map(user => this.serializeUser(user, included).data));
        includedData.push(...(book.lists || []).map(list => this.serializeList(list, included).data));
        includedData.push(...(book.comments || []).map(comment => this.serializeComment(comment, included).data));
        includedData.push(...(book.ratings || []).map(rating => this.serializeRating(rating, included).data));
    }
    
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
        included : includedData,
      };
    }
  
    static serializeBooks(books: Book[]) {
      const included = new Set();
        const serializedBooks = books.map(book => this.serializeBook(book, included));
        const includedData = serializedBooks.flatMap(book => book.included);
        return {
            data: serializedBooks.map(book => book.data),
            included: includedData,
        };
    }


    static serializeConversation(conversation: Conversation, included = new Set()) {
      const includedData: any[] = [];
  
      if (!included.has(conversation.id)) {
        included.add(conversation.id);
        includedData.push(...(conversation.participants || []).map(user => this.serializeUser(user, included).data));
        includedData.push(...(conversation.messages || []).map(message => this.serializeMessage(message, included).data));
      }
  
      return {
        data: {
          type: 'conversations',
          id: conversation.id,
          attributes: {
            lastMessageDate: conversation.lastMessageDate,
          },
          relationships: {
            participants: {
              data: conversation.participants?.map(user => ({
                type: 'users',
                id: user.id,
              })) || [],
            },
            messages: {
              data: conversation.messages?.map(message => ({
                type: 'messages',
                id: message.id,
              })) || [],
            },
          },
        },
        included: includedData,
      };
    }

    static serializeConversations(conversations: Conversation[]) {
      const included = new Set();
      const serializedConversations = conversations.map(conversation => this.serializeConversation(conversation, included));
      const includedData = serializedConversations.flatMap(conversation => conversation.included);
      return {
          data: serializedConversations.map(conversation => conversation.data),
          included: includedData,
      };
    }


    static serializeMessage(message: Message, included = new Set()) {
      const includedData: any = [];
      
      if (!included.has(message.id)) {
          included.add(message.id);

          if (message.sender) {
              includedData.push(this.serializeUser(message.sender, included).data);
          }
          if (message.receiver) {
              includedData.push(this.serializeUser(message.receiver, included).data);
          }
          if (message.conversation) {
            includedData.push(this.serializeConversation(message.conversation, included).data);
        }
      }

      return {
          data: {
              type: 'messages',
              id: message.id,
              attributes: {
                  content: message.content,
                  isRead: message.isRead,
              },
              relationships: {
                  sender: {
                      data: message.sender ? {
                          type: 'users',
                          id: message.sender.id,
                      } : null,
                  },
                  receiver: {
                      data: message.receiver ? {
                          type: 'users',
                          id: message.receiver.id,
                      } : null,
                  },
                  conversation: {
                    data: message.conversation ? {
                        type: 'conversations',
                        id: message.conversation.id,
                    } : null,
                },
              },
          },
          included: includedData,
      };
  }

  static serializeMessages(messages: Message[]) {
    const included = new Set();
    const serializedMessages = messages.map(message => this.serializeMessage(message, included));
    const includedData = serializedMessages.flatMap(message => message.included);
    return {
        data: serializedMessages.map(message => message.data),
        included: includedData,
    };
  }


    static serializeUser(user: User, included = new Set()) {
      const includedData : any = [];
      if (!included.has(user.id)) {
        included.add(user.id);
        includedData.push(...(user.booksToRead || []).map(book => this.serializeBook(book, included).data));
        includedData.push(...(user.booksInProgress || []).map(book => this.serializeBook(book, included).data));
        includedData.push(...(user.readBooks || []).map(book => this.serializeBook(book, included).data));
        includedData.push(...(user.wishList || []).map(book => this.serializeBook(book, included).data));
        includedData.push(...(user.ratings || []).map(rating => this.serializeRating(rating, included).data));
        includedData.push(...(user.comments || []).map(comment => this.serializeComment(comment, included).data));
        includedData.push(...(user.likedComments || []).map(commentLike => this.serializeCommentLike(commentLike, included).data));
        includedData.push(...(user.followers || []).map(follower => this.serializeUser(follower, included).data));
        includedData.push(...(user.following || []).map(following => this.serializeUser(following, included).data));
        includedData.push(...(user.blockedUsers || []).map(blockedUser => this.serializeUser(blockedUser, included).data));
        includedData.push(...(user.blockedBy || []).map(blockedByUser => this.serializeUser(blockedByUser, included).data));
        includedData.push(...(user.conversations || []).map(conversation => this.serializeConversation(conversation, included).data));
        includedData.push(...(user.receivedMessages || []).map(message => this.serializeMessage(message, included).data));
        includedData.push(...(user.sentMessages || []).map(message => this.serializeMessage(message, included).data));
        includedData.push(...(user.favoritesLists || []).map(list => this.serializeList(list, included).data));
        includedData.push(...(user.usersLists || []).map(list => this.serializeList(list, included).data));
    }

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
                data: user.likedComments? user.likedComments.map(commentLike => ({
                  type: 'comment-like',
                  id: commentLike.id,
                })) : [],
              },
              favoritesLists: {
                data: user.favoritesLists? user.favoritesLists.map(list => ({
                  type: 'lists',
                  id: list.id,
                })) : [],
              },
              followers: {
                data: user.followers? user.followers.map(user => ({
                  type: 'users',
                  id: user.id,
                })) : [],
              },
              following: {
                data: user.following? user.following.map(user => ({
                  type: 'users',
                  id: user.id,
                })) : [],
              },
              blockedUsers: {
                data: user.blockedUsers? user.blockedUsers.map(user => ({
                  type: 'users',
                  id: user.id,
                })) : [],
              },
              blockedBy: {
                data: user.blockedBy? user.blockedBy.map(user => ({
                  type: 'users',
                  id: user.id,
                })) : [],
              },
              conversations: {
                data: user.conversations? user.conversations.map(conversation => ({
                  type: 'conversations',
                  id: conversation.id,
                })) : [],
              },
              sentMessages: {
                data: user.sentMessages? user.sentMessages.map(message => ({
                  type: 'messages',
                  id: message.id,
                })) : [],
              },
              receivedMessages: {
                data: user.receivedMessages? user.receivedMessages.map(message => ({
                  type: 'messages',
                  id: message.id,
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
          included: includedData,
        };
    }
    
    static serializeUsers(users: User[]) {
      const included = new Set();
        const serializedUsers = users.map(user => this.serializeUser(user, included));
        const includedData = serializedUsers.flatMap(user => user.included);
        return {
            data: serializedUsers.map(user => user.data),
            included: includedData,
        };
    }
    
    static serializeList(list: List, included = new Set()) {

      const includedData = [];

      if (!included.has(list.id)) {
          included.add(list.id);
          includedData.push(...(list.likedBy || []).map(user => this.serializeUser(user, included).data));
          includedData.push(...(list.books || []).map(book => this.serializeBook(book, included).data));
          if (list.creator) {
              includedData.push(this.serializeUser(list.creator, included).data);
          }
      }

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
          included : includedData
        };
      }
    
    static serializeLists(lists: List[]) {
        return {
          data: lists.map(list => this.serializeList(list).data),
        };
    }

    static serializeComment(comment: Comment, included = new Set()) {
      const includedData : any = []; 
      if (!included.has(comment.id)) {
        included.add(comment.id);
        wrap(comment.book).init().then(includedData.push(this.serializeBook(comment.book, included).data));
        (comment.likedBy || []).map(commentLike => {wrap(commentLike).init().then(includedData.push(this.serializeCommentLike(commentLike, included).data))})
        
    }

        return {
          data: {
            type: 'comments',
            id: comment.id,
            attributes: {
              comment: comment.comment
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
                data: comment.likedBy?.map(commentLike => ({
                  type: 'comment-like',
                  id: commentLike.id,
                })) || [],
              },
            },
          },
          included : includedData,
        };
      }
    
    static serializeComments(comments: Comment[]) {
      const included = new Set();
        const serializedComments = comments.map(comment => this.serializeComment(comment, included));
        const includedData = serializedComments.flatMap(comment => comment.included);
        return {
            data: serializedComments.map(comment => comment.data),
            included: includedData,
        };
    }

    static serializeRating(rating: Rating, included = new Set()) {
      const includedData : any = [];

      if (!included.has(rating.id)) {
        included.add(rating.id);
        includedData.push(this.serializeUser(rating.user, included).data);
        includedData.push(this.serializeBook(rating.book, included).data);
    }

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
          included : includedData,
        };
      }
    
      static serializeRatings(ratings: Rating[]) {
        const included = new Set();
        const serializedRatings = ratings.map(rating => this.serializeRating(rating, included));
        const includedData = serializedRatings.flatMap(rating => rating.included);
        return {
            data: serializedRatings.map(rating => rating.data),
            included: includedData,
        };
      }

      static serializeCommentLike(commentLike: CommentLike, included = new Set()) {

        const includedData : any = [];

        if (!included.has(commentLike.id)) {
            included.add(commentLike.id);
            wrap(commentLike.user).init().then(includedData.push(this.serializeUser(commentLike.user, included).data))
            wrap(commentLike.comment).init().then(includedData.push(this.serializeComment(commentLike.comment, included).data))
        }

        return {
          data: {
            type: 'comment-like',
            id: commentLike.id,
            attributes: {
              likedAt: commentLike.likedAt,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: commentLike.user.id,
                },
              },
              comment: {
                data: {
                  type: 'comment',
                  id: commentLike.comment.id,
                },
              },
            },
          },
          included : includedData
        };
      }

      static serializeCommentLikes(commentLikes: CommentLike[]) {
        const included = new Set();
        const serializedCommentLikes = commentLikes.map(like => this.serializeCommentLike(like, included));
        const includedData = serializedCommentLikes.flatMap(like => like.included);
        return {
            data: serializedCommentLikes.map(like => like.data),
            included: includedData,
        };
      }

    
}