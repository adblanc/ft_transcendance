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

  export module Associations {
	/** Defines a 1:Many relationship type */
	export var Many: string;
	/** Defines a 1:1 relationship type */
	export var One: string;
	/** Defines a special relationship to itself */
	export var Self: string;

	// these seem to be used internally, but can't see a reason not to include them just in case
	export var SEPARATOR: string;
	export function getSeparator(): any;
	export function setSeparator(value: any): void;
	export var EVENTS_BUBBLE: boolean;
	export var EVENTS_WILDCARD: boolean;
	export var EVENTS_NC: boolean;

	interface IRelation {
		/** The type of model for this relationship */
		relatedModel: string | (new() => AssociatedModel);
		/** The key for this relationship on this model */
		key: string;
		// meh, no string enums in TS. Just have to trust the user not to be a fool
		/** The cardinality of this relationship. */
		type: string;
		/** Determines the type of collection used. If used, the relatedModel property is ignored */
		collectionType?: string | (new() => Backbone.Collection<any>);
		/** If set to true, then the attribute will not be serialized in toJSON() calls. Defaults to false */
		isTransient?: boolean;
		/** Specify remoteKey to serialize the key to a different key name in toJSON() calls. Useful in ROR nested-attributes like scenarios. */
		remoteKey?: string;
		/** the attributes to serialize when calling toJSON */
		serialize?: string[];
		/** A transformation function to convert the value before it is assigned to the key on the relatedModel */
		map?: (...args: any[]) => any;
	}

	/** A Backbone model with special provision for handling relations to other models */
	export class AssociatedModel extends Backbone.Model {
		/** Relations with their associated model */
		relations: IRelation[];
		_proxyCalls: any;
		/** Reverse association lookup for objects that contain this object */
		parents: any[];
		/** Cleans up any parent relations on other AssociatedModels */
		cleanup(): void;
	}
  }
	// copies of properties also put onto the Backbone scope
	/** Defines a 1:Many relationship type */
	export var Many: string;
	/** Defines a 1:1 relationship type */
	export var One: string;
	/** Defines a special relationship to itself */
	export var Self: string;

	// I'm sure this should be doable with imports or type aliases, but doesn't seem to work
	/** A Backbone model with special provision for handling relations to other models */
	export class AssociatedModel extends Backbone.Model {
		/** Relations with their associated model */
		relations: Associations.IRelation[];
		_proxyCalls: any;
		/** Reverse association lookup for objects that contain this object */
		parents: any[];
		/** Cleans up any parent relations on other AssociatedModels */
		cleanup(): void;
	}

}
