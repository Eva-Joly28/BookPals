import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";


export interface PagesSearchSignature {
    // The arguments accepted by the component
    Args: {
      model: BookModel[];
    };
    // Any blocks yielded by the component
    Blocks: {
      default: []
    };
    // The element to which `...attributes` is applied in the component template
    Element: null;
  }
  
  // eslint-disable-next-line ember/no-empty-glimmer-component-classes
  export default class PagesSearchComponent extends Component<PagesSearchSignature> {
  
    @tracked actualCount = 0;
    @tracked serializedArray : BookModel[] = [];

    constructor(owner: unknown, args: PagesSearchSignature['Args']){
        super(owner,args);
        this.serializedArray = this.args.model.slice(0,10);
        this.actualCount = this.serializedArray.length;
    }

    @action
    viewMore(){
        this.serializedArray = [...this.serializedArray,...this.args.model.slice(this.actualCount, this.actualCount+10)]
        this.actualCount = this.actualCount + 10; 
    }
  }