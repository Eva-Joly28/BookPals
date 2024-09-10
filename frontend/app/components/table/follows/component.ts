import Component from "@glimmer/component";
import type UserModel from "ember-boilerplate/models/user";

export interface TableFollowsSignature {
    Args:{
        users: UserModel[]
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableFollowsComponent extends Component<TableFollowsSignature>{
    
}