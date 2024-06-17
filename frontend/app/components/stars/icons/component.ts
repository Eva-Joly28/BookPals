import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";

export interface StarsIconsSignature{
    Args:{
        book : BookModel;
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class StarsIconsComponent extends Component<StarsIconsSignature>{




}