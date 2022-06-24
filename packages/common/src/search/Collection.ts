import { hubSearchQuery, IArcGISContext } from "..";
import {
  IHubCatalog,
  IHubCollection,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "./types";

/**
 * Implements Collection behavior
 */
/* istanbul ignore next */
export class Collection implements IHubCollection {
  private _context: IArcGISContext;
  private _collection: IHubCollection;
  private constructor(collection: IHubCollection, context?: IArcGISContext) {
    this._collection = collection;
    if (context) {
      this._context = context;
    }
  }

  public static async create(
    collection: IHubCollection,
    context?: IArcGISContext
  ): Promise<Collection> {
    // Async so we could extend to look up by ref like
    // https://mysite.com#documents vs passing in a full ICollection
    const col = new Collection(collection, context);
    return Promise.resolve(col);
  }

  // Getters

  public get label(): string {
    return this._collection.label;
  }
  public get key(): string {
    return this._collection.key;
  }
  public get include(): string[] {
    return this._collection.include;
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

  public async search(
    query: string | IQuery,
    options: IHubSearchOptions = {}
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
    let qry: IQuery;
    if (typeof query === "string") {
      // construct a query from that...
      qry = {
        targetEntity: this._collection.scope?.targetEntity || "item",
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

    options.requestOptions = this._context.hubRequestOptions;
    // inject default sort info if not specified
    options.sortField = options.sortField || this.sortField;
    options.sortOrder = options.sortOrder || this.sortDirection;
    // inject default includes if not specified
    options.include = options.include || this.include;

    // execute the search and return results
    return hubSearchQuery(qry, options);
  }
}
