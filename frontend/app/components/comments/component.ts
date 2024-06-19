import { service } from "@ember/service";
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"
import type SessionService from "ember-simple-auth/services/session";

export interface CommentsSignature{
    Args: {

    }
}

export default class CommentsComponent extends Component<CommentsSignature>{
    @tracked declare likeState : boolean;
    @tracked array = [1,2,3,4];
    @service declare session : SessionService;

    
}