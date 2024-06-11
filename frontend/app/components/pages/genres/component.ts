import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";

export interface PagesGenresSignature {
    Args:{
        model:{books:BookModel[], genre:string}
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PagesGenresComponent extends Component<PagesGenresSignature>{

    @tracked actualCount = 0;
    @tracked serializedArray : BookModel[] = [];

    constructor(owner: unknown, args: PagesGenresSignature['Args']){
        super(owner,args);
        this.serializedArray = this.args.model.books.slice(0,16);
        this.actualCount = this.serializedArray.length;
    }

    @action
    viewMore(){
        this.serializedArray = [...this.serializedArray,...this.args.model.books.slice(this.actualCount, this.actualCount+16)]
        this.actualCount = this.actualCount + 10; 
    }
    
}