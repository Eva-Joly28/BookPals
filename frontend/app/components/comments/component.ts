import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"

export interface CommentsSignature{
    Args: {

    }
}

export default class CommentsComponent extends Component<CommentsSignature>{
    @tracked declare likeState : boolean;
    @tracked array = [1,2,3,4];
}