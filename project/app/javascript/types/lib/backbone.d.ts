declare module Backbone {
  export class RelationalModel extends Backbone.Model {
    /**
     * Do not use, prefer TypeScript's extend functionality.
     **/
    //private static extend(properties:any, classProperties?:any):any;

    relations: any;
    subModelTypes: any;
    subModelTypeAttribute: any;

    initializeRelations(options: any): void;

    updateRelations(options: any): void;

    queue(func: any): void;

    processQueue(): void;

    getRelation(name: string): Relation;

    getRelations(): Relation[];

    fetchRelated(key: string, options?: any, update?: boolean): any;

    toJSON(options?: any): any;

    static setup();

    static build(attributes: any, options?: any);

    static findOrCreate(attributes: string, options?: any);

    static findOrCreate(attributes: number, options?: any);

    static findOrCreate(attributes: any, options?: any);
  }

  export class Relation extends Backbone.Model {
    options: any;
    instance: any;
    key: any;
    keyContents: any;
    relatedModel: any;
    relatedCollection: any;
    reverseRelation: any;
    related: any;

    checkPreconditions(): boolean;

    setRelated(related: Backbone.Model): void;

    setRelated(related: Collection<Backbone.Model>): void;

    getReverseRelations(model: RelationalModel): Relation;

    destroy(): void;
  }

  export class HasOne extends Relation {
    collectionType: any;

    findRelated(options: any): Backbone.Model;

    setKeyContents(keyContents: string): void;

    setKeyContents(keyContents: string[]): void;

    setKeyContents(keyContents: number): void;

    setKeyContents(keyContents: number[]): void;

    setKeyContents(keyContents: Collection<Backbone.Model>): void;

    onChange(model: Backbone.Model, attr: any, options: any): void;

    handleAddition(
      model: Backbone.Model,
      coll: Collection<Backbone.Model>,
      options: any
    ): void;

    handleRemoval(
      model: Backbone.Model,
      coll: Collection<Backbone.Model>,
      options: any
    ): void;

    handleReset(coll: Collection<Backbone.Model>, options: any): void;

    tryAddRelated(model: Backbone.Model, coll: any, options: any): void;

    addRelated(model: Backbone.Model, options: any): void;

    removeRelated(model: Backbone.Model, coll: any, options: any): void;
  }

  export class HasMany extends Relation {
    collectionType: any;

    findRelated(options: any): Backbone.Model;

    setKeyContents(keyContents: string): void;

    setKeyContents(keyContents: number): void;

    setKeyContents(keyContents: Backbone.Model): void;

    onChange(model: Backbone.Model, attr: any, options: any): void;

    tryAddRelated(model: Backbone.Model, coll: any, options: any): void;

    addRelated(model: Backbone.Model, options: any): void;

    removeRelated(model: Backbone.Model, coll: any, options: any): void;
  }

  export class Store extends EventsMixin implements Events {
    initializeRelation(model, relation, options);

    addModelScope(scope: any): void;

    removeModelScope(scope): void;

    addSubModels(
      subModelTypes: RelationalModel,
      superModelType: RelationalModel
    ): void;

    setupSuperModel(modelType: RelationalModel): void;

    addReverseRelation(relation: any): void;

    addOrphanRelation(relation: any): void;

    processOrphanRelations(): void;

    retroFitRelation(
      relation: RelationalModel,
      create: boolean
    ): Collection<Backbone.Model>;

    getCollection(
      type: RelationalModel,
      create: boolean
    ): Collection<Backbone.Model>;

    getObjectByName(name: string): any;

    resolveIdForItem(type: any, item: any): any;

    static find(type: any, item: string): RelationalModel;

    static find(type: any, item: number): RelationalModel;

    static find(type: any, item: RelationalModel): RelationalModel;

    static find(type: any, item: any): RelationalModel;

    register(model: RelationalModel): void;

    checkId(model: RelationalModel, id: any): void;

    update(model: RelationalModel): void;

    // tslint:disable-next-line use-default-type-parameter
    unregister(
      type:
        | RelationalModel
        | Collection<RelationalModel>
        | typeof RelationalModel
    ): void;

    reset(): void;
  }
}
