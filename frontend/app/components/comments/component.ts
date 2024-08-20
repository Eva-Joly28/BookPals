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
import type commentLikeModel from "ember-boilerplate/models/comment-like";
import type userModel from "ember-boilerplate/models/user";
import type { Invoke } from "@glint/template/-private/integration";

export interface CommentsSignature{
    Args: {
        comment: any;
    }
}

export default class CommentsComponent extends Component<CommentsSignature>{
    @tracked declare likeState : boolean;
    @tracked array = [1,2,3,4];
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare store : Store;
    @tracked declare actualComment : commentModel;
    @service declare currentUser : CurrentUserService;
    @tracked declare likeNumber : number;
    @tracked declare userLike? : commentLikeModel;

    constructor(owner: unknown, args: CommentsSignature['Args']){
        super(owner,args);
        this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
            this.actualComment = comment;
            // comment.likedBy.map((like:any)=>{this.store.unloadRecord(like)})
            // this.store.unloadRecord(comment.likedBy);
            comment.reload().then((reloadedComment:any)=> {
                this.likeNumber = reloadedComment.likedBy.length;
            })});
            if(this.session.isAuthenticated){
                this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
                    this.actualComment = comment;
                });
            this.store.findRecord('user',this.currentUser.user!.username).then((user)=>{
                this.userLike = user.likedComments.find((like : commentLikeModel) => (like.comment.id === this.actualComment.id));
                if(user.likedComments.some((like: commentLikeModel) =>{console.log(like.comment.id); like.comment.id === this.actualComment.id}
                )){
                    this.likeState = true;
                }
                else{
                    this.likeState = false;
                }
                console.log()
            });
            // this.store.findRecord('comment',this.args.comment.id).then((comment)=>{
            //     this.actualComment = comment;
            //     hasManyToArray(this.actualComment.likedBy).map((like)=>{
            //         this.store.findRecord('user',this.currentUser.user!.id).then(()=>{
            //             let user = like.get('user');
            //             if(user.id === this.currentUser.user!.id){
            //                 this.userLike = like;
            //             }
            //         });
            //     })
            //     this.userLike = hasManyToArray(this.actualComment.likedBy).find((like)=>{
            //         console.log(like);
            //         like.user.username===this.currentUser.user!.username
            //     });
                
            // });
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
        this.router.transitionTo('profile',user.id);
    
    }
} 