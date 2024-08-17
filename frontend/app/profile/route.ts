import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type Router from "ember-boilerplate/router";

export default class Profile extends Route {
    @service declare router : Router;
    model() {
        // this.router.transitionTo('profile.index');
        // return {};
      }

}