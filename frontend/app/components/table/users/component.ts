import { tracked } from "@ember/-internals/metal/lib/tracked";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type UserModel from "ember-boilerplate/models/user";
import type CurrentUserService from "ember-boilerplate/services/current-user";

export interface TableUsersSignature {
    Args:{
        users: UserModel[]
    }
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableUsersComponent extends Component<TableUsersSignature>{
    @service declare currentUser : CurrentUserService;

}