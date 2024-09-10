import { helper } from "@ember/component/helper";
import { service } from "@ember/service";
import type UserModel from "ember-boilerplate/models/user";

export default helper(function iconAction([currentUser,user]:[UserModel,UserModel]){
    if(currentUser.following.includes(user)){
        return 'cross'
    }
    else{
        return 'plus'
    }
})