import { service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import { tracked } from "@glimmer/tracking";
import config from "ember-boilerplate/config/environment";
import type CurrentUserService from "ember-boilerplate/services/current-user";
import type Store from "ember-boilerplate/services/store";
import Base from "ember-simple-auth/authenticators/base";
import SessionService from "ember-simple-auth/services/session";
import RSVP, { reject, resolve } from "rsvp";

export default class JwtAuthenticator extends Base {
    @service declare store : Store;
    @service('current-user') declare currentUser : CurrentUserService;
    @tracked token:any;
    @tracked id = '';

    async restore(data: any): Promise<unknown> {
        return new RSVP.Promise((resolve, reject) => {
            if(!this._validateData(data)){
                return reject('there is no token to restore the session');
            }
            return resolve(data);
        })
        // if(!data.token){
        //     reject(data)  
        // }
        // return resolve(data);
    }

    _validateData(data:any) {
        return !isEmpty(data) && !isEmpty(data.token);
      }

    async authenticate(username: string, password: string) {
        let response = await fetch(`${config.host}/${config.namespace}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password})
        })

        if(!response.ok){
            throw new Error('change credentials');
        }
        let r = await response.json();
        this.id = r.id;
        this.token = {accessToken:r.token,refreshToken:r.accessToken};
        
        return {token: this.token, id:this.id.toString()};
    }

    

    async invalidate(): Promise<unknown> {
        this.token = null;
        this.currentUser.user = undefined;
        this.currentUser.id = '';
        return resolve();
    }

}
