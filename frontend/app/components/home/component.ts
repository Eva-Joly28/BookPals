import type Store from "@ember-data/store";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";

interface PagesHomeSignature {
    Args: {
        model : BookModel[];
    }
}


export default class PagesHomeComponent extends Component<PagesHomeSignature>{
    @service declare store : Store;

     get topBooks() {
        return this.args.model;
    } 
    
}