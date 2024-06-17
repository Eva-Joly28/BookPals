import { action } from "@ember/object"
import { service } from "@ember/service"
import Component from "@glimmer/component"
import { tracked } from "@glimmer/tracking"
import type Router from "ember-boilerplate/router"
import type Store from "ember-boilerplate/services/store"

export interface CommentsAddSignature{
    Args: {

    }
}

export default class CommentsAddComponent extends Component<CommentsAddSignature>{
    @service declare store : Store;
    @service declare router : Router;


    @action
    postComment(){
        
    }
}