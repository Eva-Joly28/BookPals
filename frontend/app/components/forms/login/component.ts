import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { LoginChangeset } from "ember-boilerplate/changesets/login";
import type Router from "ember-boilerplate/router";
import type LoginChangesetService from "ember-boilerplate/services/changesets/login";
import loginSchema from "ember-boilerplate/validations/login";
import type FlashMessageService from "ember-cli-flash/services/flash-messages";
import type SessionService from "ember-simple-auth/services/session";

export interface FormsLoginSignature{
    Args : {
        setAlert:Function;
    }
}

export default class FormsLoginComponent extends Component<FormsLoginSignature> {
    @service declare flashMessages :  FlashMessageService;
    @tracked declare changeset : LoginChangeset;
    @service('changesets/login') declare loginService : LoginChangesetService;
    @service declare session : SessionService;
    @service declare router : Router
    validationSchema = loginSchema;

    constructor(owner : unknown, args: FormsLoginSignature['Args']) {
        super(owner,args);
        this.changeset = this.loginService.emptyChangeset();
    }

    @action
    async submit(){
        try{
            await this.session.authenticate('authenticator:jwt',this.changeset.get('username'),this.changeset.get('password'));
            this.session.handleAuthentication(this.router.currentURL!)
           
        //    else{
        //     this.args.setAlert('Les identifiants sont incorrects');
        //    }
                    
        }
        catch(e){
            this.args.setAlert('Les identifiants sont incorrects');
        }
    }

    
}