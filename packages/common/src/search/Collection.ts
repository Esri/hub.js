import { cloneObject, IArcGISContext } from "..";
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
   * TBD if we implement this
   * Fetch a collection from a catalog stored with an item
   * @param collection
   * @param context
   * @returns
   */
  // public static async init(
  //   identifier: string,
  //   context?: IArcGISContext
  // ): Promise<Collection> {
  //   // TODO: Need to decide how to handle the url identifier for portal
  //   // since the portal urls already have `#` in them, we'd need to do
  //   // some convoluted work.
  //   // OR just throw for portal if it's not a GUID
  //   // Async so we could extend to look up by ref like
  //   // https://mysite.com#documents vs passing in a full ICollection
  //   const col = new Collection(collection, context);
  //   return Promise.resolve(col);
  // }

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
