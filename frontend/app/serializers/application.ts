import JSONSerializer from '@ember-data/serializer/json';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import RESTSerializer from '@ember-data/serializer/rest';


import type { Snapshot } from '@ember-data/store';
import type Store from 'ember-boilerplate/services/store';


export default class Application extends JSONAPISerializer {
  serializeAttribute(
    snapshot: Snapshot,
    json: Record<string, unknown>,
    key: string,
    attributes: Record<string, unknown>
  ) {
    if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key]) {
      super.serializeAttribute(snapshot, json, key, attributes);
    }
  }

  serialize(snapshot : Snapshot, options : any) {
    let json : any = super.serialize(snapshot, options);

    // // Filtrer les relations pour n'inclure que celles qui ont été modifiées
    // if (json.data && json.data.relationships) {
    //   Object.keys(json.data.relationships).forEach((key) => {
    //     if (snapshot.hasMany(key)) {
    //       let currentIds = snapshot.hasMany(key)!.map(record => record.id);
    //       let originalIds = snapshot.record.hasMany(key).ids();

    //       if (currentIds.join(',') === originalIds.join(',')) {
    //         delete json.data.relationships[key];
    //       }
    //     } else if (!snapshot.changedAttributes()[key]) {
    //       delete json.data.relationships[key];
    //     }
    //   });
    // }


    return json;
  }

  keyForAttribute(key: string) {
    return key;
  }

  keyForRelationship(key: string) {
    return key;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    application: Application;
  }
}
