import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type Store from "ember-boilerplate/services/store";

export interface StarsSignature{
    Args:{

    }
}

export default class StarsComponent extends Component<StarsSignature>{
    numbers = [1,2,3,4,5];
    @service declare store : Store;
    @tracked starRating = 0

    constructor(owner: unknown, args: StarsSignature['Args']){
        super(owner,args);

    }

    @action
    setHover(star : number){
        this.starRating = star;
    }
}