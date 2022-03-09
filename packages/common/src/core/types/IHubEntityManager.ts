import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { Filter, IHubSearchOptions, ISearchResponse } from "../..";

/**
 * Baseline CRUD+Search functions required for all Store classes
 */
export interface IHubEntityManager<T> {
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
  fetch(identifier: string, requestOptions: IRequestOptions): Promise<T>;

  /**
   * Search for Entitys of type `T`
   *
   * Note: When implementing, this should be a search for things of type `T`
   * not searching "within" the `T`.
   *
   * i.e. Searching for Teams, not searching for content shared to a team.
   * @param filter
   * @param opts
   */
  search(
    filter: Filter<"content">,
    opts: IHubSearchOptions
  ): Promise<ISearchResponse<T>>;
}
