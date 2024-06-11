function filterFields(entities: any[], excludeFields: string[]): any[] {
    return entities.map(entity => {
      const filteredEntity = { ...entity };
      excludeFields.forEach(field => delete filteredEntity[field]);
      return filteredEntity;
    });
  }