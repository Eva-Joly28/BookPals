import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
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

  @action
  gotoBook(id : string){
    this.router.transitionTo('books.book', id);
  }
}
