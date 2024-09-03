/* eslint-disable ember/no-side-effects */
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type RatingModel from "ember-boilerplate/models/rating";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import { updateRecord } from "ember-boilerplate/utils/update-model";
import { updateRead, updateStatus } from "ember-boilerplate/utils/updating-collections";
import { number } from "yup";

export interface StarsSignature{
    Args:{
        rating : RatingModel;
        book : BookModel;
        id : string;
        value : number;
    }
}

export default class StarsComponent extends Component<StarsSignature>{
    numbers = [1,2,3,4,5];
    @service declare store : Store;
    @service declare currentUser : CurrentUserService;
    @tracked starRating = 0;
    @tracked actualRate = 0;
    // eslint-disable-next-line ember/no-tracked-properties-from-args
    @tracked  userRating  = this.args.rating;
    @tracked userRateState = false; 

    constructor(owner: unknown, args: StarsSignature['Args']){
        super(owner,args);
        this.actualRate = this.args.value;

    }

    get available(){
        return this.args.rating !== undefined;
    }

    get rate(){
        let rate =  this.args.rating;
        return rate.value;

    }


    @action
    setHover(star : number){
        this.starRating = star;
        if(this.args.rating){
            this.userRating = this.args.rating;
            this.actualRate = this.args.rating.value;
        }
    }

    @action
    async setClick(star : number){
        this.actualRate = star;
        if(!this.args.rating){
            let user = await this.store.findRecord('user',this.currentUser.user!.id);
            let book = await this.store.findRecord('book',this.args.book.id);
            let newRate = this.store.createRecord('rating',{
            user: user,
            value : this.actualRate,
            book: book
            })
            await newRate.save();
            if(!user.readBooks.some((b:any)=>b.id==book.id)){
                await updateRead(book, 'push', user);
                book.reload();
            }
            await updateStatus(book,3);

        }
        else{
            let data = {
                "data": {
                    "id": `${this.args.rating.id}`,
                    "type": "ratings",
                    "attributes": {
                        "value": star
                    }
                    }
                }
            await updateRecord('ratings',this.args.rating.id,data);
            
        }
    }

    @action
    deleteRating(id : string){
        this.store.findRecord('rating',id).then((r)=>{
            r.destroyRecord();
        });
    }


}