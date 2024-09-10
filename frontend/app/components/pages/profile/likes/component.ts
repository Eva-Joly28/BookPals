import { service } from "@ember/service";
import Component from "@glimmer/component";
import type UserModel from "ember-boilerplate/models/user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileLikesSignature {
    Args : {
        user : UserModel;
    }
}

export default class ProfileLikesComponent extends Component<ProfileLikesSignature>{
    @service declare session : SessionService;
}