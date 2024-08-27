import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type messageModel from "ember-boilerplate/models/message";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileNavSignature {
    Args: {
        user : userModel
    }
}

export default class ProfileNavComponent extends Component<ProfileNavSignature>{
    @service declare session : SessionService;
    @service declare currentUser : CurrentUserService;
    @service declare router : Router;

    constructor(owner: unknown, args: ProfileNavSignature['Args']){
        super(owner,args);
    }

      get isReadActive() {
        return this.router.isActive('profile.read');
      }
    
      get isToReadActive() {
        return this.router.isActive('profile.to-read');
      }
    
      get isWishListActive() {
        return this.router.isActive('profile.wishlist');
      }
    
      get isInProgressActive() {
        return this.router.isActive('profile.in-progress');
      }
    
      get isListsActive() {
        return this.router.isActive('profile.lists');
      }
    
      get isLikedActive() {
        return this.router.isActive('profile.liked');
      }
    
      get isReviewsActive() {
        return this.router.isActive('profile.reviews');
      }
    
      get isFriendsActive() {
        return this.router.isActive('profile.friends');
      }

      get isMessagesActive() {
        return this.router.isActive('profile.messages');
      }

      get isCurrentUser(){
          if(this.currentUser.user && (this.currentUser.user.id == this.args.user.id) ){
            return true;
          }
          return false;
      }

      get unreadMessages(){
        let unreadTab : messageModel[] = [];
        this.args.user.conversations.forEach(c => {
          c.messages.forEach(m=>{
            if(!m.isRead){
              unreadTab = [...unreadTab, m];
            }
          })
        });
        return unreadTab;
      }
    

    @action
    goToRead(){
        this.router.transitionTo('profile.read', this.args.user.username);
    }

    @action
    goTotoRead(){
        this.router.transitionTo('profile.to-read', this.args.user.username);
    }

    @action
    goToInProgress(){
        this.router.transitionTo('profile.in-progress', this.args.user.username);

    }

    @action
    goToWishlist(){
        this.router.transitionTo('profile.wishlist', this.args.user.username);
    }

    @action
    goToRatings(){
        this.router.transitionTo('profile.ratings', this.args.user.username);
    }

    @action
    goToReviews(){
        this.router.transitionTo('profile.reviews', this.args.user.username);
    }

    @action
    goToNetwork(){
        this.router.transitionTo('profile.followers', this.args.user.username);
    }

    @action
    goToMessages(){
        this.router.transitionTo('profile.messages', this.args.user.username);
    }
}