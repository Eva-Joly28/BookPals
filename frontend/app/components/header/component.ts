import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type Router from "ember-boilerplate/router";

interface HeaderSignature{
    Args:{

    }
}

// eslint-disable-next-line ember/require-tagless-components, ember/no-empty-glimmer-component-classes
export default class HeaderComponent extends Component<HeaderSignature>{
    @service declare router: Router;
    @tracked isIndex : boolean = true;
    @tracked searchValue = '';
    declare currentRoute : string|null;
    constructor(owner : unknown, args: HeaderSignature['Args']) {
        super(owner,args);
        this.currentRoute = this.router.currentRouteName;
        this.isIndex = this.currentRoute === 'index'? true : false;
        this.router.on('routeDidChange', () => {
            this.currentRoute = this.router.currentRouteName;
            this.isIndex = this.currentRoute === 'index'? true : false;
        })
        console.log(this.currentRoute);
        console.log(this.isIndex);

    }

    @action
    backHome(){
        this.router.transitionTo('index');
    }

    @action
    search(e: any){
        if(e.key === 'Enter'){
            this.searchValue = e.target.value;
            console.log(this.searchValue);
            this.router.transitionTo('search', this.searchValue.replaceAll(' ','-'));
        }
    }

    @action
    updateValue(e: InputEvent){
        this.searchValue = e.data ? e.data : '';
        console.log(this.searchValue);
    }
}