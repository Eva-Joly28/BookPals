import Component from "@glimmer/component";

export interface AlertSignature {
    Args:{
        visibility : string;
        alertText : string;
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class AlertComponent extends Component<AlertSignature> {

}