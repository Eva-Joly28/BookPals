import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-boilerplate/config/environment';
import type BookModel from 'ember-boilerplate/models/book';
import type Router from 'ember-boilerplate/router';

export interface CardBaseSignature {
  // The arguments accepted by the component
  Args: {
    book: BookModel;
    addStyle: string;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: []
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class CardBaseComponent extends Component<CardBaseSignature> {

  @service declare router : Router;
  @tracked imageUrl = '';
  @tracked visibility = 'invisible'

  constructor(owner: unknown, args: CardBaseSignature['Args']){
    super(owner,args);

  }
  

  @action
  goToBook(book_id : string){
    this.router.transitionTo('book-details', book_id);
    console.log(book_id);
  }

}
