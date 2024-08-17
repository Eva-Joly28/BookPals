import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";
import { format } from 'date-fns';
import type commentModel from "ember-boilerplate/models/comment";
import { hasManyToArray } from "ember-boilerplate/utils/has-many-to-array";
import commentLikeModel from "ember-boilerplate/models/comment-like";
import type RatingModel from "ember-boilerplate/models/rating";
import type { Invoke } from "@glint/template/-private/integration";

export interface CommentsProfileSignature{
    Args: {
        comment: any;
    }
}

export default class CommentsProfileComponent extends Component<CommentsProfileSignature>{
    @tracked declare likeState : boolean;
    @tracked array : number[] = [];
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare store : Store;
    @tracked declare actualComment : commentModel;
    @service declare currentUser : CurrentUserService;
    @tracked declare likeNumber : number;
    @tracked declare userLike? : commentLikeModel;

    constructor(owner: unknown, args: CommentsProfileSignature['Args']){
        super(owner,args);
        let bookRate = this.args.comment.user.ratings.find((rate:RatingModel)=> rate.book.id === this.args.comment.book.id);
        if(bookRate){
            let tab = [];
            for (let i = 1; i <=bookRate.value ; i++) {
                this.array.push(i);  
            }
        }
        this.likeNumber = this.args.comment.likedBy.length;
        console.log(this.args.comment);
        if(this.session.isAuthenticated){
            this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
                this.actualComment = comment;
                this.userLike = this.currentUser.user!.likedComments.find((like)=>like.comment.id==this.actualComment.id)
                console.log(this.currentUser.user!.id)
                console.log(this.actualComment.id);
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
            this.likeNumber += 1;
            let user = await this.store.findRecord('user',this.currentUser.user!.id);
            let newLike = this.store.createRecord('comment-like',{
                user: user,
                comment : this.actualComment,
                likedAt: format(new Date(), 'yyyy-MM-dd')
            })
            await newLike.save();
            this.userLike = newLike;
        }
        else{
            this.store.findRecord('comment-like',this.userLike!.id).then((like)=>{
                like.destroyRecord();
            });
            this.likeNumber -= 1
        }
    }
}