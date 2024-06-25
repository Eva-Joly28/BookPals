import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileReadSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileReadComponent extends Component<ProfileReadSignature>{
    @service declare session : SessionService;
}