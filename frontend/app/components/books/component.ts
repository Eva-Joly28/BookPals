import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component"
import type BookModel from "ember-boilerplate/models/book";
import type Router from "ember-boilerplate/router";
import sanitizeHtml from "sanitize-html";

export interface BooksSignature {
    Args : {
        book : BookModel
    }
}

export default class BooksComponent extends Component<BooksSignature>{
    @service declare router : Router; 

    constructor(owner: unknown, args: BooksSignature['Args']){
        super(owner,args);
    }

    get description(){
        const clean = sanitizeHtml(this.args.book.description, {
          allowedTags:['br','i','p','strong','b'],
          allowedAttributes:{}
        });
        let result = htmlSafe(clean);
        if(result.toString().length<=800){
          console.log(result);
          return result;
        } 
        else{
          return htmlSafe(this.getExtract(result.toString()))
        }
      }

    getExtract(text:string, maxLength: number = 400){
        if(text.length <= maxLength) {
            return text;
        }
        const extract = text.slice(0,maxLength);
        const lastPeriodIndex = extract.lastIndexOf('.');
        if(lastPeriodIndex !== -1){
            return extract.slice(0,lastPeriodIndex+1);
        }
        return extract+'...';
    }

    @action
    goToBook(id: string){
      this.router.transitionTo('book-details', id);
    }
}