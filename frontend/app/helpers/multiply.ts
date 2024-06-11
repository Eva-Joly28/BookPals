import { helper } from "@ember/component/helper";

export default helper(function multiply([nbr]:[any]){
    parseInt(nbr.toString());
    return nbr*5+"px"
})