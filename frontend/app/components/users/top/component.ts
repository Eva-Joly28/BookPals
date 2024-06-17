import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type userModel from "ember-boilerplate/models/user";
import type Store from "ember-boilerplate/services/store";
import type SessionService from "ember-simple-auth/services/session";

export interface UsersTopSignature {
    Args:{
        user : userModel;
    }
}

export default class UsersTopComponent extends Component<UsersTopSignature>{
    @service declare store : Store;
    @service declare session : SessionService;
}