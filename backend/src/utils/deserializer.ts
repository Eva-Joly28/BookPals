export default class JsonApiDeserializer {

    static deserializeBook(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
      
      const book: any = {
        ...attributes,
      };

      if (relationships.usersWishlists) {
        book.usersWishlists = relationships.usersWishlists.data.map((item: any) => item.id);
      }
      if (relationships.usersToRead) {
        book.usersToRead = relationships.usersToRead.data.map((item: any) => item.id);
      }
      if (relationships.usersInProgress) {
        book.usersInProgress = relationships.usersInProgress.data.map((item: any) => item.id);
      }
      if (relationships.usersReadBooks) {
        book.usersReadBooks = relationships.usersReadBooks.data.map((item: any) => item.id);
      }
      if (relationships.lists) {
        book.lists = relationships.lists.data.map((item: any) => item.id);
      }
      if (relationships.comments) {
        book.comments = relationships.comments.data.map((item: any) => item.id);
      }
      if (relationships.ratings) {
        book.ratings = relationships.ratings.data.map((item: any) => item.id);
      }

      return book;
    }
  
    static deserializeUser(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const user: any = {
        ...attributes,
      };

      if (relationships.booksToRead) {
        user.booksToRead = relationships.booksToRead.data.map((item: any) => item.id);
      }
      if (relationships.booksInProgress) {
        user.booksInProgress = relationships.booksInProgress.data.map((item: any) => item.id);
      }
      if (relationships.readBooks) {
        user.readBooks = relationships.readBooks.data.map((item: any) => item.id);
      }
      if (relationships.wishList) {
        user.wishList = relationships.wishList.data.map((item: any) => item.id);
      }
      if (relationships.ratings) {
        user.ratings = relationships.ratings.data.map((item: any) => item.id);
      }
      if (relationships.comments) {
        user.comments = relationships.comments.data.map((item: any) => item.id);
      }
      if (relationships.likedComments) {
        user.likedComments = relationships.likedComments.data.map((item: any) => item.id);
      }
      if (relationships.favoritesLists) {
        user.favoritesLists = relationships.favoritesLists.data.map((item: any) => item.id);
      }
      if (relationships.followers) {
        user.followers = relationships.followers.data.map((item: any) => item.id);
      }
      if (relationships.following) {
        user.following = relationships.following.data.map((item: any) => item.id);
      }
      if (relationships.blockedUsers) {
        user.blockedUsers = relationships.blockedUsers.data.map((item: any) => item.id);
      }
      if (relationships.blockedBy) {
        user.blockedBy = relationships.blockedBy.data.map((item: any) => item.id);
      }
      if (relationships.conversations) {
        user.conversations = relationships.conversations.data.map((item: any) => item.id);
      }
      if (relationships.sentMessages) {
        user.sentMessages = relationships.sentMessages.data.map((item: any) => item.id);
      }
      if (relationships.receivedMessages) {
        user.receivedMessages = relationships.receivedMessages.data.map((item: any) => item.id);
      }
      if (relationships.usersLists) {
        user.usersLists = relationships.usersLists.data.map((item: any) => item.id);
      }  
  
      return user;
    }

    static deserializeConversation(jsonApiData: any): any {
      const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
      const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const conversation: any = {
        ...attributes,
      };
  
      if (relationships.participants) {
        conversation.participants = relationships.participants.data.map((item: any) => item.id);
      }
      if (relationships.messages) {
        conversation.messages = relationships.messages.data.map((item: any) => item.id);
      }
  
      return conversation;
    }

    static deserializeConversations(jsonApiDataArray: any[]): any[] {
      return jsonApiDataArray.map(this.deserializeConversation);
    }
  
    static deserializeList(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const list: any = {
        ...attributes,
      };
  
      
    if (relationships.likedBy) {
        list.likedBy = relationships.likedBy.data.map((item: any) => item.id);
      }
      if (relationships.books) {
        list.books = relationships.books.data.map((item: any) => item.id);
      }
      if (relationships.creator && relationships.creator.data) {
        list.creator = relationships.creator.data.id;
    }

      return list;
    }
  
    static deserializeComment(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const comment: any = {
        ...attributes,
      };

      if (relationships.book && relationships.book.data) {
        comment.book = relationships.book.data.id;
      }
      if (relationships.user && relationships.user.data) {
        comment.user = relationships.user.data.id;
      }
      if (relationships.likedBy) {
        comment.likedBy = relationships.likedBy.data.map((item: any) => item.id);
      }
  
      return comment;
    }

    static deserializeMessage(jsonApiData: any): any {
      const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
      const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const message: any = {
        ...attributes,
      };
  
      if (relationships.sender) {
        message.sender = relationships.sender.data ? relationships.sender.data.id : null;
      }
      if (relationships.conversation) {
        message.conversation = relationships.conversation.data ? relationships.conversation.data.id : null;
      }
      if (relationships.receiver) {
        message.receiver = relationships.receiver.data ? relationships.receiver.data.id : null;
      }
  
      return message;
    }
  
    static deserializeRating(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const rating: any = {
        ...attributes,
      };

      if (relationships.user && relationships.user.data) {
        rating.user = relationships.user.data.id;
      }
      if (relationships.book && relationships.book.data) {
        rating.book = relationships.book.data.id;
      }
  
      return rating;
    }
  
    static deserializeCommentLike(jsonApiData: any): any {
        const attributes = jsonApiData.data.attributes ? jsonApiData.data.attributes : {};
        const relationships = jsonApiData.data.relationships ? jsonApiData.data.relationships : {};
  
      const commentLike: any = {
        ...attributes,
      };

      if (relationships.user && relationships.user.data) {
        commentLike.user = relationships.user.data.id;
      }
      if (relationships.comment && relationships.comment.data) {
        commentLike.comment = relationships.comment.data.id;
      }  
  
      return commentLike;
    }
  }
  