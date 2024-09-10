import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type CommentModel from "ember-boilerplate/models/comment";
import type Router from "ember-boilerplate/router";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export interface CommentsUpdateSignature{
    Args: {
        comment: any;
    }
}

export default class CommentsUpdateComponent extends Component<CommentsUpdateSignature>{
    @service declare session : SessionService;
    @service declare router : Router;
    @service declare store : Store;
    @tracked declare actualComment : CommentModel;
    @service declare currentUser : CurrentUserService;
    @tracked optionsVisible = false;

    constructor(owner: unknown, args: CommentsUpdateSignature['Args']){
        super(owner,args);

    }

    @action
    setHover(visible : boolean){
        this.optionsVisible = visible;
    }

    @action
    goToUser(user: any){
        this.router.transitionTo('profile',user.id);
    
    }
} 