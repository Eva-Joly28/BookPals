import { helper } from "@ember/component/helper";
import { service } from "@ember/service";
import type UserModel from "ember-boilerplate/models/user";

export default helper(function background([currentUser,user]:[UserModel,UserModel]){
    if(currentUser.following.includes(user)){
        return 'bg-red-400'
    }
    else{
        return 'bg-green-400'
    }
})

