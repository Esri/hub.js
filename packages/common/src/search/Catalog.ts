import { IArcGISContext } from "../ArcGISContext";
import HubError from "../HubError";
import { cloneObject } from "../util";
import { mapBy } from "../utils";
import { Collection } from "./Collection";
import { fetchCatalog } from "./fetchCatalog";
import { hubSearch } from "./hubSearch";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
import {
  EntityType,
  ICatalogScope,
  IHubCatalog,
  IQuery,
} from "./types/IHubCatalog";
import { upgradeCatalogSchema } from "./upgradeCatalogSchema";

/**
 * Catalog Class
 * Abstracts handling of scope cascades into Collections
 */
export class Catalog implements IHubCatalog {
  private _context: IArcGISContext;
  private _catalog: IHubCatalog;

  // internal - use static factory methods
  private constructor(catalog: IHubCatalog, context: IArcGISContext) {
    this._catalog = catalog;
    this._context = context;
  }

  /**
   * Create a Collection instance from a Catalog json object, a site url or itemId
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
    context: IArcGISContext
  ): Promise<Catalog> {
    // fetch the catalog
    const fetched = await fetchCatalog(identifier, context.hubRequestOptions);
    // return an instance
    return new Catalog(fetched, context);
  }

  /**
   * Create a Catalog instance from a Catalog Json object
   * @param json
   * @param context
   * @returns
   */
  static fromJson(json: any, context: IArcGISContext): Catalog {
    // ensure it's in the latest structure
    json = upgradeCatalogSchema(json);
    return new Catalog(cloneObject(json), context);
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
   * Titke setter
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
   * Get the scope's query for a particular entity type
   * @param type
   * @returns
   */
  getScope(type: EntityType): IQuery | undefined {
    return this._catalog.scopes[type];
  }

  /**
   * Set the scope for a specific entity type
   * @param type
   * @param query
   */
  setScope(type: EntityType, query: IQuery) {
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
    const json = this._catalog.collections.find((entry) => entry.key === name);
    if (json) {
      // clone it then merge in the associated scope filter
      const clone = cloneObject(json);
      const catalogScope = this.getScope(clone.scope.targetEntity);
      if (catalogScope?.filters) {
        clone.scope.filters = [...clone.scope.filters, ...catalogScope.filters];
      }
      return Collection.fromJson(clone, this._context);
    } else {
      throw new HubError(
        "getCollection",
        `Collection "${name}" is not present in the Catalog`
      );
    }
  }

  /**
   * Execute a search against the Catalog as a whole
   * @param query
   * @param targetEntity
   * @returns
   */
  search(
    query: string | IQuery,
    options: IHubSearchOptions = { targetEntity: "item" }
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    const targetEntity = options.targetEntity;
    if (typeof query === "string") {
      query = {
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
    }
    // Now merge in catalog scope level filters
    if (this._catalog.scopes[targetEntity]) {
      query.filters = [
        ...query.filters,
        ...this._catalog.scopes[targetEntity].filters,
      ];
    }

    // An instance always uses the context so we remove any
    delete options.authentication;
    options.requestOptions = this._context.hubRequestOptions;

    // delegate
    return hubSearch(query, options);
  }
}
