import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";

export interface PagesAuthorsSignature {
    Args:{
        model:{books:BookModel[], author:string}
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PagesAuthorsComponent extends Component<PagesAuthorsSignature>{
    @tracked actualCount = 0;
    @tracked serializedArray : BookModel[] = [];

    constructor(owner: unknown, args: PagesAuthorsSignature['Args']){
        super(owner,args);
        this.serializedArray = this.args.model.books.slice(0,16);
        this.actualCount = this.serializedArray.length;
    }

    @action
    viewMore(){
        this.serializedArray = [...this.serializedArray,...this.args.model.books.slice(this.actualCount, this.actualCount+8)]
        this.actualCount = this.actualCount + 10; 
    }
    
}