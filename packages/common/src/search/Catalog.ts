import { IArcGISContext } from "../ArcGISContext";
import HubError from "../HubError";
import { Collection } from "./Collection";
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

/* istanbul ignore next */
export class Catalog implements IHubCatalog {
  private _context: IArcGISContext;
  private _catalog: IHubCatalog;

  private constructor(catalog: IHubCatalog, context: IArcGISContext) {
    this._catalog = catalog;
    this._context = context;
  }

  static fromJson(json: IHubCatalog, context: IArcGISContext): Catalog {
    return new Catalog(json, context);
  }

  get schemaVersion() {
    return this._catalog.schemaVersion;
  }

  get title() {
    return this._catalog.title;
  }

  get scopes(): ICatalogScope {
    return this._catalog.scopes;
  }

  get collections() {
    return this._catalog.collections || [];
  }

  getCollection(name: string): Collection {
    const json = this._catalog.collections.find((entry) => entry.key === name);
    if (json) {
      return Collection.fromJson(json, this._context);
    } else {
      throw new HubError(
        "getCollection",
        `Collection ${name} is not present in the Catalog`
      );
    }
  }

  search(
    query: string | IQuery,
    targetEntity: EntityType = "item"
  ): Promise<IHubSearchResponse<IHubSearchResult>> {
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
    // create request options
    // TODO: How should we get options into this fn?
    // = add targetEntity to the IHubSearchOptions?
    // - add another arg?
    const opts: IHubSearchOptions = {
      requestOptions: this._context.hubRequestOptions,
    };
    // delegate
    return hubSearch(query, opts);
  }
}
