import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IHubSearchOptions } from "../../search/types/IHubSearchOptions";
import { ISearchResponse } from "../../types";
import { IHubSearchResponse, IQuery } from "../../search";

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
  delete(id: string, requestOptions: IUserRequestOptions): Promise<void>;
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
   * @param query
   * @param opts
   */
  search(
    query: IQuery,
    opts: IHubSearchOptions
  ): Promise<IHubSearchResponse<T>>;
}
