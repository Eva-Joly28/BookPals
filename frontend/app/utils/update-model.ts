import config from "ember-boilerplate/config/environment";
import fetch from 'ember-fetch';
import $ from 'jquery';
import { stringify, toJSON } from "flatted";


export async function updateRecord(model:string,id:string,data:any){
    
    // const response = await fetch(`${config.host}/${config.namespace}/${model}/${id}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });
  
    //   if (!response.ok) {
    //     throw new Error(`Failed to update resource with id ${id}`);
    //   }
  
    //   return response.json();

    // eslint-disable-next-line ember/no-jquery
    return $.ajax({
      url: `${config.host}/${config.namespace}/${model}/${id}`,
      type: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(data,function(key, val) {
        var seen : any[] = [];
        if (val != null && typeof val == "object") {
             if (seen.indexOf(val) >= 0) {
                 return;
             }
             seen.push(val);
         }
         return val;
     }),
    }).then((response:any) => {
      return response;
    }).catch((error:any) => {
      throw new Error(`Failed to update resource with id ${id}`);
    });
}