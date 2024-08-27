import config from "ember-boilerplate/config/environment";
import fetch from 'ember-fetch';


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

    return $.ajax({
      url: `${config.host}/${config.namespace}/${model}/${id}`,
      type: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(data),
    }).then((response:any) => {
      return response;
    }).catch((error:any) => {
      throw new Error(`Failed to update resource with id ${id}`);
    });
}