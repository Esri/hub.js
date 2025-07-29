import type { IArcGISContext } from "../types/IArcGISContext";
import { ArcGISContextManager } from "../ArcGISContextManager";
import { HubEntityType } from "../core/types/HubEntityType";
import { catalogContains } from "../core/catalogContains";
import HubError from "../HubError";
import { cloneObject } from "../util";
import { mapBy } from "../utils";
import { fetchEntityCatalog } from "./fetchEntityCatalog";
import { Collection } from "./Collection";
import { hubSearch } from "./hubSearch";
import {
  EntityType,
  ISearchResponseHash,
  IContainsOptions,
  IContainsResponse,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  ICatalogScope,
  IHubCatalog,
  IQuery,
  IFilter,
  IHubCollection,
  ICatalogDisplayConfig,
} from "./types";
import { upgradeCatalogSchema } from "./upgradeCatalogSchema";

/**
 * Catalog Class
 *
 * Abstracts working with Catalogs and fetching collections with
 * the correct scope applied.
 *
 * For more information, check out the [Catalog & Collection Guide](/hub.js/guides/concepts/catalog-collection/)
 */
export class Catalog implements IHubCatalog {
  private _context: IArcGISContext;
  private _catalog: IHubCatalog;
  private _containsCache: Record<string, IContainsResponse> = {};

  // internal - use static factory methods
  private constructor(catalog: IHubCatalog, context: IArcGISContext) {
    this._catalog = catalog;
    this._context = context;
  }

  /**
   * Fetch a catalog
   * At this point, it returns the `.catalog` property from the entity
   * @param identifier url, guid, cuid
   * @param context
   * @param options is possible, pass the hubEntityType to improve fetching performance
   * @returns
   */
  public static async init(
    identifier: string,
    context?: IArcGISContext,
    options?: {
      hubEntityType: HubEntityType;
      prop: string;
    }
  ): Promise<Catalog> {
    // create default context if none passed
    if (!context) {
      const mgr = await ArcGISContextManager.create();
      context = mgr.context;
    }
    // fetch the catalog
    const fetched = await fetchEntityCatalog(identifier, context, options);
    // return an instance
    if (fetched) {
      return new Catalog(fetched, context);
    } else {
      throw new HubError("Catalog.fetch", "No catalog found for the entity");
    }
  }
  /**
   * Create a Catalog instance from a Catalog Definition Json object
   * @param json
   * @param context
   * @returns
   */
  static fromJson(json: IHubCatalog, context?: IArcGISContext): Catalog {
    // ensure it's in the latest structure
    const catalog = upgradeCatalogSchema(json);
    return new Catalog(catalog, context);
  }

  /**
   * Return the JSON object backing the instance
   * @returns
   */
  toJson(): IHubCatalog {
    return cloneObject(this._catalog);
  }

  /**
   * Return the schema version
   */
  get schemaVersion() {
    return this._catalog.schemaVersion;
  }

  /**
   * Title getter
   */
  get title() {
    return this._catalog.title;
  }

  /**
   * Title setter
   */
  set title(v: string) {
    this._catalog.title = v;
  }

  /**
   * Return the existing scopes hash
   */
  get scopes(): ICatalogScope {
    return this._catalog.scopes || {};
  }
  /**
   * Return an array of the entity types available in this Catalog
   */
  get availableScopes(): EntityType[] {
    return Object.keys(this.scopes) as unknown as EntityType[];
  }

  /**
   * Return the display configuration for the gallery
   */
  get displayConfig(): ICatalogDisplayConfig {
    return this._catalog.displayConfig;
  }

  /**
   * Get the scope's query for a particular entity type
   * @param type
   * @returns
   */
  getScope(type: EntityType): IQuery | undefined {
    return this._catalog.scopes?.[type];
  }

  /**
   * Set the scope for a specific entity type
   * @param type
   * @param query
   */
  setScope(type: EntityType, query: IQuery) {
    // TODO: This needs to be much smarter in terms of merging
    // existing filters with the new ones. Basically this
    // hides very little complexity from the developer
    this._catalog.scopes[type] = query;
  }

  /**
   * Get the collections array. Returns simple objects not Collection instances
   */
  get collections() {
    return this._catalog.collections || [];
  }

  /**
   * Get the names of the collections
   */
  get collectionNames(): string[] {
    return mapBy("key", this.collections);
  }

  /**
   * Get a Collection instance by name
   * @param name
   * @returns
   */
  getCollection(name: string): Collection {
    const json = this.getCollectionJson(name);
    return Collection.fromJson(json, this._context);
  }

  /**
   * Add a collection
   * @param {IHubCollection} collection
   */
  addCollection(collection: IHubCollection) {
    this._catalog.collections?.length
      ? this._catalog.collections.push(collection)
      : (this._catalog.collections = [collection]);
  }

  /**
   * Get the Collection json by name
   * @param name
   * @returns
   */
  getCollectionJson(name: string): IHubCollection {
    const json = this.collections.find((entry) => entry.key === name);
    if (json) {
      // clone it then merge in the associated scope filter
      const clone = cloneObject(json);
      const catalogScope = this.getScope(clone.scope.targetEntity);
      if (catalogScope?.filters) {
        clone.scope.filters = [
          ...(clone.scope.filters || []),
          ...catalogScope.filters,
        ];
      }
      return clone;
    } else {
      throw new HubError(
        "getCollectionJson",
        `Collection "${name}" is not present in the Catalog`
      );
    }
  }

  /**
   * Get a Collection instance, based on a specific entity type and filters
   * This extends from the base scope for the entity type
   * @param type
   * @param filters
   * @returns
   */
  getCustomCollection(type: EntityType, filters: IFilter[]): Collection {
    // create the collection
    const collection: IHubCollection = this.getCustomCollectionJson(
      type,
      filters
    );
    // create instance
    return Collection.fromJson(collection, this._context);
  }

  /**
   * Create a custom collection based on a specific entity type and filters
   * Returned collection extends from the base scope for the entity type
   * @param type
   * @param filters
   * @returns
   */
  getCustomCollectionJson(
    type: EntityType,
    filters: IFilter[]
  ): IHubCollection {
    // get the scope
    const scopeQuery = this.getScope(type);
    // create the collection
    const collection: IHubCollection = {
      key: `${type}-custom`,
      label: `${type} Custom`,
      targetEntity: type,
      scope: {
        targetEntity: type,
        filters: [...(scopeQuery?.filters || []), ...filters],
      },
    };
    return collection;
  }

  /**
   * Search for Items
   * Will throw if the Catalog does not have a scope defined for items
   * @param query - string or IQuery
   * @param options
   * @returns
   */
  async searchItems(
    query: string | IQuery,
    options?: IHubSearchOptions
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    if (!options) {
      options = this.getDefaultSearchOptions("item");
    }
    if (!this.getScope("item")) {
      const result = this.getEmptyResult();
      result.messages = [
        {
          code: "missingScope",
          message: "Catalog does not have a scope for items",
          data: {
            scope: "item",
          },
        },
      ];
      return Promise.resolve(result);
    } else {
      // ensure it's an item search
      options.targetEntity = "item";
      return this.search(query, options);
    }
  }

  async contains(
    identifier: string,
    options: IContainsOptions
  ): Promise<IContainsResponse> {
    const start = Date.now();
    // check if we have cached results for this identifier
    if (this._containsCache[identifier]) {
      const cachedResult = cloneObject(this._containsCache[identifier]);
      cachedResult.duration = Date.now() - start;
      return Promise.resolve(cachedResult);
    } else {
      // delegate to catalogContains
      const result = await catalogContains(
        identifier,
        this._catalog,
        this._context,
        options
      );
      // add to cache...
      this._containsCache[identifier] = result;
      result.duration = Date.now() - start;
      return result;
    }
  }

  /**
   * Search for Groups
   * Will throw if the Catalog does not have a scope defined for groups
   * @param query  - string or IQuery
   * @param options
   * @returns
   */
  async searchGroups(
    query: string | IQuery,
    options?: IHubSearchOptions
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    if (!options) {
      options = this.getDefaultSearchOptions("group");
    }
    if (!this.getScope("group")) {
      const result = this.getEmptyResult();
      result.messages = [
        {
          code: "missingScope",
          message: "Catalog does not have a scope for groups",
          data: {
            scope: "group",
          },
        },
      ];
      return Promise.resolve(result);
    } else {
      // ensure it's an group search
      options.targetEntity = "group";
      return this.search(query, options);
    }
  }

  /**
   * Search for Users
   * Will throw if the Catalog does not have a scope defined for users
   * @param query  - string or IQuery
   * @param options
   * @returns
   */
  async searchUsers(
    query: string | IQuery,
    options: IHubSearchOptions = {}
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    if (!this.getScope("user")) {
      const result = this.getEmptyResult();
      result.messages = [
        {
          code: "missingScope",
          message: "Catalog does not have a scope for user",
          data: {
            scope: "user",
          },
        },
      ];
      return Promise.resolve(result);
    } else {
      // ensure it's an group search
      options.targetEntity = "user";
      return this.search(query, options);
    }
  }

  /**
   * Execute a term search against all the collections in the Catalog
   * or an IQuery against all collections that match the targetEntity.
   * Note: This will not search scopes which do not have corresponding collections.
   * If you want that behavior, use `searchCatalogs` function instead.
   * @param query  - string or IQuery
   * @param options
   * @returns
   */
  async searchCollections(
    query: string | IQuery,
    options: IHubSearchOptions = {}
  ): Promise<ISearchResponseHash> {
    // build a query
    let passedQuery = true;
    let qry: IQuery;
    if (typeof query === "string") {
      passedQuery = false;
      qry = {
        targetEntity: "item", // this gets replaced below, but we need something here
        filters: [
          {
            predicates: [
              {
                term: query,
              },
            ],
          },
        ],
      };
    } else {
      qry = query;
    }

    // iterate the colllections, issue searchs for each one
    const promiseKeys: string[] = [];
    const promises = this.collectionNames.reduce((acc, name) => {
      const col = this.getCollection(name);
      // if an IQuery was passed in,
      if (passedQuery) {
        // we only execute queries on collections that match the targetEntity
        // and skip the rest
        if (col.targetEntity === qry.targetEntity) {
          promiseKeys.push(name);
          acc.push(col.search(qry, options));
        }
      } else {
        // if a string was passed in, we execute the search on all collections
        // by replacing the targetEntity in the query to match the collection
        promiseKeys.push(name);
        qry.targetEntity = col.targetEntity;
        acc.push(col.search(qry, options));
      }
      return acc;
    }, []);

    const responses = await Promise.all(promises);

    // merge the responses into the hash
    const hash: ISearchResponseHash = {};
    for (let i = 0; i < promiseKeys.length; i++) {
      hash[promiseKeys[i]] = responses[i];
    }
    return hash;
  }

  /**
   * Execute a term search against all the scopes in the Catalog
   * @param query - term or IQuery
   * @param options
   * @returns
   */
  async searchScopes(
    query: string | IQuery,
    options: IHubSearchOptions = {},
    limitTo?: EntityType[]
  ): Promise<ISearchResponseHash> {
    let qry: IQuery;
    if (typeof query === "string") {
      qry = {
        targetEntity: "item", // this gets replaced below, but we need something here
        filters: [
          {
            predicates: [
              {
                term: query,
              },
            ],
          },
        ],
      };
    } else {
      qry = query;
    }

    const promiseKeys: string[] = [];
    const promises = this.availableScopes.reduce((acc, entityType) => {
      if (!limitTo || limitTo.includes(entityType)) {
        promiseKeys.push(entityType);
        const qryClone = cloneObject(qry);
        const optsClone = cloneObject(options);
        qryClone.targetEntity = entityType;
        optsClone.targetEntity = entityType;
        acc.push(this.search(qryClone, optsClone));
      }
      return acc;
    }, []);

    // wait for all the searches to complete
    const responses = await Promise.all(promises);

    // merge the responses into the hash
    const hash: ISearchResponseHash = {};
    for (let i = 0; i < promiseKeys.length; i++) {
      hash[promiseKeys[i]] = responses[i];
    }
    return hash;
  }

  /**
   * Execute a term search or IQuery search against the Catalog.
   * @param query - term or IQuery
   * @param options
   * @returns
   */
  private async search(
    query: string | IQuery,
    options: IHubSearchOptions
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    let targetEntity = options.targetEntity;
    let qry: IQuery;
    if (typeof query === "string") {
      qry = {
        targetEntity,
        filters: [
          {
            predicates: [
              {
                term: query,
              },
            ],
          },
        ],
      } as IQuery;
    } else {
      targetEntity = query.targetEntity;
      qry = cloneObject(query);
    }

    // Now merge in catalog scope level filters if they exist
    const scope = this.getScope(targetEntity);
    // Since the public methods (searchItem etc) all
    // check for the scope before calling this method
    // we can assume that the scope exists, but this is extra
    // defensive just to ensure we don't blow up
    /* istanbul ignore else */
    if (scope) {
      qry.filters = [...qry.filters, ...scope.filters];
    }

    const opts = cloneObject(options);
    // An Catalog instance always uses the context so we remove/replace any passed in auth
    delete opts.authentication;
    opts.requestOptions = this._context.hubRequestOptions;

    return hubSearch(qry, opts);
  }

  /**
   * Construct an empty result. Returned when a search is performed against an entity type that
   * does not have a scope defined.
   * @returns
   */
  private getEmptyResult(): IHubSearchResponse<IHubSearchResult> {
    return {
      results: [],
      total: 0,
      hasNext: false,
      next: null,
    };
  }

  private getDefaultSearchOptions(type: EntityType): IHubSearchOptions {
    return {
      targetEntity: type,
      num: 10,
      start: 1,
      requestOptions: this._context.hubRequestOptions,
    };
  }
}
