import Service from "@ember/service";
import { LoginChangeset } from "ember-boilerplate/changesets/login";
// import { service } from "@ember/service";
import { inject as service } from '@ember/service';
import type Router from "ember-boilerplate/router";
import type SessionService from "ember-simple-auth/services/session";
import type CurrentUserService from "../current-user";
import type FlashMessageService from "ember-cli-flash/services/flash-messages";
import Index from "ember-boilerplate/index/route";

export default class LoginChangesetService extends Service{
    @service declare session: SessionService;
    @service declare router : Router
    @service('current-user') declare currentUser : CurrentUserService;
    @service declare flashMessages :  FlashMessageService;

    emptyChangeset(): LoginChangeset{
        return new LoginChangeset({
            username : '',
            password :'',
        })
    }

    async save(changeset : LoginChangeset){
        changeset.execute();
        let username = changeset.get('username');
        let password = changeset.get('password');

        try{
            await this.session.authenticate('authenticator:jwt', username, password);
            // if(this.router.currentURL === null){
            //     this.session.handleAuthentication('index');
            // }
            this.session.handleAuthentication('index');
            window.location.reload();
        }catch(error) {
            this.flashMessages.alert('les identifiants sont incorrects')
        }
        
    }
}

declare module '@ember/service' {
    interface Registry {
      'changesets/register': LoginChangesetService;
    }
  }