import Model, { type SyncHasMany } from '@ember-data/model';

export function hasManyToArray<T extends Model>(hasMany: SyncHasMany<T>): T[] {
  return Array.from(hasMany as never) as T[];
}
