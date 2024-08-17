import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-boilerplate/config/environment';
import type BookModel from 'ember-boilerplate/models/book';
import type Router from 'ember-boilerplate/router';
import type CurrentUserService from 'ember-boilerplate/services/current-user';

export interface CardProfileSignature {
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

export default class CardProfileComponent extends Component<CardProfileSignature> {

  @service declare router : Router;
  @service declare currentUser : CurrentUserService;
  @tracked ratingArray : number[] = [];

  constructor(owner: unknown, args: CardProfileSignature['Args']){
    super(owner,args);
    let rating = this.currentUser.user?.ratings.find((rate)=>{rate.book.id == this.args.book.id})
    if(rating){
        for(let i = 0; i<rating.value; i++){
            this.ratingArray.push(i);
        }
    }

  }
  

}
