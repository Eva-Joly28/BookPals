import { service } from "@ember/service";
import Component from "@glimmer/component";
import type LoadingService from "ember-boilerplate/services/loading";

export default class SpinnerComponent extends Component{
    @service declare load : LoadingService;
}