import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type userModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";

export interface ProfileNavDetailsSignature {
    Args: {
        user : userModel
    }
}

export default class ProfileNavComponent extends Component<ProfileNavDetailsSignature>{
    @service declare router : Router;

    @action
    goToProfile(){
        this.router.transitionTo('profile.index', this.args.user.username);
    }
}