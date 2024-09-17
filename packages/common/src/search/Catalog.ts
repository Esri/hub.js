import { IArcGISContext } from "../ArcGISContext";
import { ArcGISContextManager } from "../ArcGISContextManager";
import HubError from "../HubError";
import { cloneObject } from "../util";
import { isGuid, mapBy, isCuid } from "../utils";
import { Collection } from "./Collection";
import { fetchCatalog } from "./fetchCatalog";
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
  IPredicate,
  IQuery,
  IFilter,
  IHubCollection,
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
   * Create a Catalog instance from a site url or itemId
   * '''js
   * const catalog = await Catalog.create('https://site-org.hub.arcgis.com', context);
   * '''
   *
   * @param identifier
   * @param context
   * @returns
   */
  public static async init(
    identifier: string,
    context?: IArcGISContext
  ): Promise<Catalog> {
    // if context is not passed, create a default that point to AGO prod
    if (!context) {
      const mgr = await ArcGISContextManager.create();
      context = mgr.context;
    }
    // fetch the catalog
    const fetched = await fetchCatalog(identifier, context.hubRequestOptions);
    // return an instance
    return new Catalog(fetched, context);
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
    return this._catalog.scopes;
  }
  /**
   * Return an array of the entity types available in this Catalog
   */
  get availableScopes(): EntityType[] {
    return Object.keys(this.scopes || {}) as unknown as EntityType[];
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
        clone.scope.filters = [...clone.scope.filters, ...catalogScope.filters];
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

  /**
   * Does the Catalog contain a specific piece of content?
   * @param identifier id or slug of the content
   * @param options entityType if known; otherwise will execute one search for each scope
   * @returns
   */
  async contains(
    identifier: string,
    options: IContainsOptions
  ): Promise<IContainsResponse> {
    const start = Date.now();
    const catalog = this._catalog;
    // check if we have cached results for this identifier
    if (this._containsCache[identifier]) {
      const cachedResult = cloneObject(this._containsCache[identifier]);
      cachedResult.duration = Date.now() - start;
      return Promise.resolve(cachedResult);
    } else {
      // construct the response
      const response: IContainsResponse = {
        identifier,
        isContained: false,
        // no need to return the catalogInfo
        // in this function.
      };
      // construct the predicate
      const pred: IPredicate = {};

      if (isGuid(identifier) || isCuid(identifier)) {
        pred.id = identifier;
      } else {
        // treat as slug
        pred.typekeywords = `slug|${identifier}`;
      }
      // construct the queries
      const queries = [];
      if (options.entityType) {
        if (this.scopes[options.entityType]) {
          queries.push({
            targetEntity: options.entityType,
            filters: [{ predicates: [pred] }],
          });
        } else {
          // no scope for this entity type, thus it cannot be in the catalog
          response.duration = Date.now() - start;
          this._containsCache[identifier] = response;
          return Promise.resolve(response);
        }
      } else {
        // Construct a query for each scope
        Object.keys(catalog.scopes).forEach((type) => {
          queries.push({
            targetEntity: type as EntityType,
            filters: [{ predicates: [pred] }],
          });
        });
      }
      // execute the queries
      const results = await Promise.all(
        queries.map((q) =>
          // We set num to be 10 to account for api not doing exact matching on slugs
          this.search(q, { targetEntity: q.targetEntity, num: 10 })
        )
      );

      // if any of the queries returned a result, then the entity is contained
      response.isContained = results.reduce((isContained, queryResponse) => {
        if (queryResponse.results.length) {
          if (pred.id) {
            isContained = true;
          } else {
            // slug based search, which is not exact,
            // so we manually verify the exact slug matches
            isContained = queryResponse.results.reduce(
              (slugKeywordPresent, entry) => {
                if (entry.typeKeywords.includes(pred.typekeywords)) {
                  slugKeywordPresent = true;
                }
                return slugKeywordPresent;
              },
              false as boolean
            );
          }
        }
        return isContained;
      }, false as boolean);
      response.duration = Date.now() - start;
      // add to cache...
      this._containsCache[identifier] = response;
      // return the response
      return response;
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

    // Now merge in catalog scope level filters
    qry.filters = [...qry.filters, ...this.getScope(targetEntity).filters];

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
