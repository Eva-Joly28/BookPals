import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type RatingModel from "ember-boilerplate/models/rating";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";

export interface StarsSignature{
    Args:{
        rating : any;
        book : BookModel;
    }
}

export default class StarsComponent extends Component<StarsSignature>{
    numbers = [1,2,3,4,5];
    @service declare store : Store;
    @service declare currentUser : CurrentUserService;
    @tracked starRating = 0
    @tracked actualRate = 0
    @tracked declare userRating : RatingModel;
    @tracked userRateState = false; 

    constructor(owner: unknown, args: StarsSignature['Args']){
        super(owner,args);
        console.log(this.args.rating);
        if(this.args.rating){
            this.store.findRecord('rating',this.args.rating.id).then((r)=>{
                this.userRating = r;
                this.starRating = r.value;
                this.actualRate = r.value;
            });
        }

    }


    @action
    setHover(star : number){
        this.starRating = star;
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
        }
        else{
            let rate = this.store.findRecord('rating',this.args.rating.id).then((r)=>{
                r.value = star;
                r.save();
            })
            
        }
    }

    @action
    deleteRating(){
        this.store.findRecord('rating',this.args.rating.id).then((r)=>{
            r.destroyRecord();
        });
    }


}