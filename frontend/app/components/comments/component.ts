import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";
import { format, isThisSecond } from 'date-fns';
import type CommentModel from "ember-boilerplate/models/comment";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import type CommentLikeModel from "ember-boilerplate/models/comment-like";
import type UserModel from "ember-boilerplate/models/user";
import type { Invoke } from "@glint/template/-private/integration";
import type RatingModel from "ember-boilerplate/models/rating";

export interface CommentsSignature{
    Args: {
        comment: any;
    }
}

export default class CommentsComponent extends Component<CommentsSignature>{
    @tracked declare likeState : boolean;
    @tracked array: number[] = [];
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare store : Store;
    @tracked declare actualComment : CommentModel;
    @service declare currentUser : CurrentUserService;
    @tracked declare likeNumber : number;
    @tracked declare userLike? : CommentLikeModel;

    constructor(owner: unknown, args: CommentsSignature['Args']){
        super(owner,args);

        let bookRate : any;
        this.args.comment.user.reload().then((u:any)=>{
            bookRate = u.ratings.find((rate:RatingModel)=> {
                rate.reload().then(r=>{
                    r.book.id === this.args.comment.book.id
                })
            });
        })
        //  = this.args.comment.user.ratings.find((rate:RatingModel)=> rate.book.id === this.args.comment.book.id);
        if(bookRate){
            let tab = [];
            for (let i = 1; i <=bookRate.value ; i++) {
                this.array.push(i);  
            }
        }

        this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
            this.actualComment = comment;
            comment.reload().then((reloadedComment:any)=> {
                this.likeNumber = reloadedComment.likedBy.length;
            })});
            if(this.session.isAuthenticated){
                this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
                    this.actualComment = comment;
                    this.userLike = this.currentUser.user!.likedComments.find((like : CommentLikeModel) => (like.comment.id==this.actualComment.id));
                    if(this.userLike){
                        this.likeState = true;
                    }
                    else{
                        this.likeState = false;
                    }
                });
            
        }

    }

    @action
    async toggleLike(){
        this.likeState = !this.likeState;
        if(this.likeState){
            let user = await this.store.findRecord('user',this.currentUser.user!.id);
            let newLike = this.store.createRecord('comment-like',{
                user: user,
                comment : this.actualComment,
                likedAt: format(new Date(), 'yyyy-MM-dd')
            })
            await newLike.save();
            this.userLike = newLike;
            this.actualComment.get('likedBy').reload().then((updatedLikes)=> {
                this.likeNumber = updatedLikes.length;
            })
        }
        else{
            let like = this.store.peekRecord('comment-like', this.userLike!.id);
            like.destroyRecord();
            this.likeNumber = this.likeNumber==0? 0 : this.likeNumber-1;
        }
    }

    @action
    goToUser(user: any){
        this.router.transitionTo('profile',user.username);
    
    }
} 