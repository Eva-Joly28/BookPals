import { helper } from "@ember/component/helper";
import { service } from "@ember/service";
import type userModel from "ember-boilerplate/models/user";

export default helper(function iconAction([currentUser,user]:[userModel,userModel]){
    if(currentUser.following.includes(user)){
        return 'cross'
    }
    else{
        return 'plus'
    }
})