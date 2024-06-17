import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";

export interface StarsSignature{
    Args:{
        book : BookModel;
    }
}

export default class StarsComponent extends Component<StarsSignature>{
    numbers = [1,2,3,4,5];
    @service declare store : Store;
    @service declare currentUser : CurrentUserService;
    @tracked starRating = 0
    @tracked actualRate = 0

    constructor(owner: unknown, args: StarsSignature['Args']){
        super(owner,args);
        // this.store.queryRecord('rating',{book:this.args.book,user:this.currentUser.user}).then((rate)=>{
        //     if(rate) this.actualRate= rate.value;
        // })

    }


    @action
    setHover(star : number){
        this.starRating = star;
    }

    @action
    setClick(star : number){
        this.actualRate = star;
    }




}