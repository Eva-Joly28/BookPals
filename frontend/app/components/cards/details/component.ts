import Component from "@glimmer/component";
import type BookModel from "ember-boilerplate/models/book";


export interface CardDetailsSignature {
    // The arguments accepted by the component
    Args: {
      book: BookModel;
    };
    // Any blocks yielded by the component
    Blocks: {
      default: []
    };
    // The element to which `...attributes` is applied in the component template
    Element: null;
  }
  
  // eslint-disable-next-line ember/no-empty-glimmer-component-classes
  export default class CardDetailsComponent extends Component<CardDetailsSignature> {
  
    
  }