import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type SessionService from "ember-simple-auth/services/session";

export interface ProfileWishlistSignature {
    Args : {
        user : userModel;
    }
}

export default class ProfileWishlistComponent extends Component<ProfileWishlistSignature>{
    @service declare session : SessionService;
}