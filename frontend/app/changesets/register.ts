import ImmerChangeset from "ember-immer-changeset";

export interface RegisterDTO {
    username: string;
    email : string;
    password: string;
    confirmPassword: string;
}

export class RegisterChangeset extends ImmerChangeset<RegisterDTO> {}