import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { LoginChangeset } from "ember-boilerplate/changesets/login";
import type Router from "ember-boilerplate/router";
import type LoginChangesetService from "ember-boilerplate/services/changesets/login";
import type SessionService from "ember-boilerplate/services/session";
import loginSchema from "ember-boilerplate/validations/login";
import type FlashMessageService from "ember-cli-flash/services/flash-messages";

export interface FormsLoginSignature{
    Args : {

    }
}

export default class FormsLoginComponent extends Component<FormsLoginSignature> {
    @service declare flashMessages :  FlashMessageService;
    @tracked declare changeset : LoginChangeset;
    @service('changesets/login') declare loginService : LoginChangesetService;
    @service('session') declare session : SessionService;
    @service declare router : Router
    validationSchema = loginSchema;

    constructor(owner : unknown, args: FormsLoginSignature['Args']) {
        super(owner,args);
        this.changeset = this.loginService.emptyChangeset();
    }

    @action
    submit(){
        try{
            this.loginService.save(this.changeset);
        }
        catch(e){
            this.flashMessages.danger("les identifiants sont incorrects");
        }
    }
}