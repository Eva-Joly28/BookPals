import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type CommentModel from "ember-boilerplate/models/comment";

export interface ModalsCommentInterface{
    Args:{
        comment : CommentModel;
    }
}


export default class ModalsCommentComponent extends Component<ModalsCommentInterface> {
    @tracked disabled = false;
    @tracked commentText = '';

    constructor(owner: unknown, args: ModalsCommentInterface['Args']){
        super(owner,args);
        this.commentText = this.args.comment.comment;
    }


    get charCount(){
        return Array.from(this.commentText).length;
    }

    @action
    updateCharCount(event:any) {
        this.commentText = event.target.value;
        if(this.commentText.length>2299) this.disabled=true;
    }
}