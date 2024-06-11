import { helper } from "@ember/component/helper";

export default helper(function rounder([nbr]:[any]){
    parseInt(nbr.toString());
    if(nbr>=1000){
        let result = Math.round(nbr/1000)+'K';
        return result
    }
    return nbr.toString();
})