import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type Store from "ember-boilerplate/services/store";

export interface RateSignature{
    Args:{
        ratings : any
    }
}

export default class RateComponent extends Component<RateSignature>{
    numbers = [1,2,3,4,5];

    constructor(owner: unknown, args: RateSignature['Args']){
        super(owner,args);


    }

    get average(){
        let total = 0;
        this.args.ratings.forEach((element:any) => {
            total += element.value;
        });
        return (total/this.args.ratings.length).toFixed(1);
    }
    

}