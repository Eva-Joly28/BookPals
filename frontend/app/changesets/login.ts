import ImmerChangeset from "ember-immer-changeset";

export interface LoginDTO {
    username : string;
    password: string;
}

export class LoginChangeset extends ImmerChangeset<LoginDTO>{}