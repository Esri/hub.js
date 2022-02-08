import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Filter, IHubSearchOptions, ISearchResponse } from "../..";

/**
 * Baseline CRUD+Search functions required for all Store classes
 */
export interface IHubEntityStore<T> {
  /**
   * Create and Store a new Entity
   * @param obj
   * @param requestOptions
   */
  create(obj: T, requestOptions: IUserRequestOptions): Promise<T>;
  /**
   * Update an existing Entity
   * @param obj
   * @param requestOptions
   */
  update(obj: T, requestOptions: IUserRequestOptions): Promise<T>;
  /**
   * Destroy an Entity
   * @param id
   * @param requestOptions
   */
  destroy(id: string, requestOptions: IUserRequestOptions): Promise<void>;
  /**
   * Get an entity by an identifier. Implementations can handle this
   * differently as needed. i.e. a HubProject can be fetched by item id (guid)
   * or by a slug.
   * @param identifier
   * @param requestOptions
   */
  get(identifier: string, requestOptions: IRequestOptions): Promise<T>;

  /**
   * [WIP] We need to work out how best to handle the typing on this. Simply
   * delegating to `searchContent` with a filter constraining to an Entity type
   * will return `ISearchResponse<IHubContent>` and not the expected type.
   *
   * Search for Entitys of type `T`
   *
   * Note: When implementing, this should be a search for things of type `T`
   * not searching "within" the `T`.
   *
   * i.e. Searching for Teams, not searching for content shared to a team.
   * @param filter
   * @param opts
   */
  // search(
  //   filter: Filter<"content">,
  //   opts: IHubSearchOptions
  // ): Promise<ISearchResponse<T>>;
}
