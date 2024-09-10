import type { SyncHasMany } from "@ember-data/model";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type BookModel from "ember-boilerplate/models/book";
import type CommentModel from "ember-boilerplate/models/comment";
import type UserModel from "ember-boilerplate/models/user";
import type Store from "ember-boilerplate/services/store";

export interface ProfileReviewsSignature {
    Args : {
        model : {user:UserModel,comments:SyncHasMany<CommentModel>,ratings:SyncHasMany<CommentModel>};
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class ProfileReadComponent extends Component<ProfileReviewsSignature>{
    @service declare store : Store;

    // @action
    // async returnBook(rate : any){
    //     let book: BookModel;
    //     let actualRate = await this.store.findRecord('rating', rate.id);
    //     book = actualRate.book;
    //     console.log(book);
    //     return book;
    // }

}