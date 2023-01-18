import { cloneObject, IArcGISContext } from "../index";
import {
  EntityType,
  IHubCollection,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "./types";
import { hubSearch } from "./hubSearch";
/**
 * Collection Class
 *
 * Abstracts searching a Collection
 *
 * For more information, check out the [Catalog & Collection Guide](/hub.js/guides/concepts/catalog-collection/)
 */
export class Collection implements IHubCollection {
  private _context: IArcGISContext;
  private _collection: IHubCollection;
  private constructor(collection: IHubCollection, context: IArcGISContext) {
    this._collection = collection;
    this._context = context;
  }

  /**
   * Create an instance of a Collection from a JSON object
   * @param collection
   * @param context
   * @returns
   */
  public static fromJson(
    collection: IHubCollection,
    context: IArcGISContext
  ): Collection {
    return new Collection(collection, context);
  }

  /**
   * Return the JSON object backing the instance
   * @returns
   */
  toJson(): IHubCollection {
    return cloneObject(this._collection);
  }

  // Getters

  public get label(): string {
    return this._collection.label;
  }
  public get key(): string {
    return this._collection.key;
  }
  public get include(): string[] {
    return this._collection.include || [];
  }
  public get scope(): IQuery {
    return this._collection.scope;
  }
  public get sortField(): string {
    return this._collection.sortField || "title";
  }
  public get sortDirection(): "asc" | "desc" {
    return this._collection.sortDirection || "asc";
  }
  public get targetEntity(): EntityType {
    return this._collection.targetEntity;
  }

  /**
   * Search the collection using a string or IQuery
   * @param query
   * @param options
   * @returns
   */
  public async search(
    query: string | IQuery,
    options: IHubSearchOptions = {}
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    let qry: IQuery;
    if (typeof query === "string") {
      // construct a query from that...
      qry = {
        targetEntity: this._collection.targetEntity,
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

    // TODO: What should happen when a Query is passed in that has a targetEntity that doesn't match the collection's targetEntity?

    // merge the passed in query w/ the scope
    qry.filters = [...qry.filters, ...this.scope.filters];
    const opts = cloneObject(options);
    opts.requestOptions = this._context.hubRequestOptions;
    // inject default sort info if not specified
    opts.sortField = options.sortField || this.sortField;
    opts.sortOrder = options.sortOrder || this.sortDirection;
    // inject default includes if not specified
    opts.include = options.include || this.include;

    // execute the search and return results
    return hubSearch(qry, opts);
  }
}
