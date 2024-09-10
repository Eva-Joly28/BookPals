import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { RegisterChangeset } from "ember-boilerplate/changesets/register";
import config from "ember-boilerplate/config/environment";
import type UserModel from "ember-boilerplate/models/user";
import type Router from "ember-boilerplate/router";
import type Store from "ember-boilerplate/services/store";
import registerSchema from "ember-boilerplate/validations/register";
import type FlashMessageService from "ember-cli-flash/services/flash-messages";
import type SessionService from "ember-simple-auth/services/session";

export interface FormsRegisterSignature{
    Args : {
        setAlert : Function;
        users : UserModel[];
        onClose : Function;
    }
}

export default class FormsLoginComponent extends Component<FormsRegisterSignature> {
    @service declare flashMessages :  FlashMessageService;
    @tracked declare changeset : RegisterChangeset;
    @tracked declare visible : string;
    @tracked declare availability : string;
    @tracked inputValue = "";
    validationSchema = registerSchema;
    @service declare store : Store;
    @service declare session : SessionService;
    @service declare router : Router;

    constructor(owner : unknown, args: FormsRegisterSignature['Args']) {
        super(owner,args);
        this.visible = 'invisible';
        this.changeset = new RegisterChangeset({
            username : '',
            password : '',
            email : '',
            confirmPassword: ''
        })
       
    }

    get users() {
        return this.args.users;
    }

    close(){
        this.args.onClose();
    }

    @action
    async submit(){
        this.changeset.set('username', this.inputValue);
        this.changeset.execute();
        console.log(this.changeset.isValid);
        const{email,password} = this.changeset.data;
        // console.log(this.changeset.data);
        // if(this.changeset.isInvalid){
        //     console.log(this.changeset.errors)
        //     this.setAlert('Veuillez remplir correctement les identifiants')
        // }  
        // else{
            try{
                let res = await this.register(this.inputValue, email, password);
                if(res.ok){
                    this.close();
                    await this.session.authenticate('authenticator:jwt',this.inputValue,password);
                    //window.location.reload();
                    this.session.handleAuthentication(this.router.currentURL!)
                }
            }
            catch(e){
                this.setAlert('Veuillez remplir correctement les identifiants');
            // }
        }
    }

    @action
    setAlert(text : string){
        this.args.setAlert(text);
    }

    @action
    onChangeUsername(e : string){
        this.inputValue = e;
        // this.visible = 'visible'
        // if(this.users.some((user)=> user.username.toLowerCase() == e.toLowerCase())){
        //     this.availability = "indisponible";
        // }
        // else{
        //     this.availability = "disponible";
        // }
    }

    async register(username:string, email:string, password:string){
        let response = await fetch(`${config.host}/${config.namespace}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password,email})
        })

        if(!response.ok){
            throw new Error('Please fill all inputs')
        }
        return response;
    }
}