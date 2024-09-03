import { action } from "@ember/object"
import { service } from "@ember/service"
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"
import type BookModel from "ember-boilerplate/models/book"
import type Router from "ember-boilerplate/router"
import type CurrentUserService from "ember-boilerplate/services/current-user"
import type Store from "ember-boilerplate/services/store"
import DOMPurify from 'dompurify';
import { updateStatus } from "ember-boilerplate/utils/updating-collections"

export interface CommentsAddSignature{
    Args: {
        book : BookModel;
    }
}

export default class CommentsAddComponent extends Component<CommentsAddSignature>{
    @service declare currentUser : CurrentUserService;
    @service declare store : Store;
    @service declare router : Router;
    @tracked commentText = '';
    @tracked isDisabled = '';
    @tracked disableButton: boolean = false;


    get charCount(){
        return Array.from(this.commentText).length;
    }

    @action
    updateCharCount(event:any) {
        this.commentText = event.target.value;
        if(this.commentText.length>1400) this.isDisabled='disabled';
    }

    @action
    setDisabled(value:boolean){
        this.disableButton = value;
    }

    @action
    async postComment(){
        if (this.commentText.trim().length < 3) {
            alert('Le commentaire est trop court ou vide.');
            return;
        }

        let sanitizedComment = DOMPurify.sanitize(this.commentText.trim());

        if (sanitizedComment !== this.commentText.trim()) {
        alert('Le commentaire contient des éléments non autorisés.');
        return;
        }

        let user = await this.store.findRecord('user',this.currentUser.user!.id);
        let book = await this.store.findRecord('book',this.args.book.id);
        let newComment = this.store.createRecord('comment', {
            comment : sanitizedComment,
            user : user,
            book : book,
        })
        await newComment.save();
        this.commentText = '';
        await updateStatus(book,5)
        await this.args.book.reload()
        window.location.reload();
    }


}