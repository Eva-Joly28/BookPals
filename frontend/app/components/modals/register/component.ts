import { action } from "@ember/object";
import { later } from "@ember/runloop";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export interface ModalRegisterSignature{
    Args : {
        
    }
}

export default class ModalRegisterComponent extends Component<ModalRegisterSignature>{
    @tracked isOpen = false;
    @tracked visibility = "invisible";
    @tracked alertText = "";

    @action
    setAlert(text : string){
        this.alertText = text;
        this.visibility = "visible";
        // eslint-disable-next-line ember/no-runloop
        later(() => {this.visibility="invisible"}, 3000);
    }
}