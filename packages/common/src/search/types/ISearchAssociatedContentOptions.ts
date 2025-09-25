import { HubEntity } from "../../core/types/HubEntity";
import { IHubRequestOptions } from "../../hub-types";
import { IQuery } from "./IHubCatalog";

/**
 * Options for searching associated content for a given entity
 */
export interface ISearchAssociatedContentOptions {
  /**
   * The entity to search for associated content
   */
  entity: HubEntity;
  /**
   * The type of association to search for (e.g., "related", "connected")
   */
  association: "related" | "connected";
  /**
   * The request options to use for the search
   */
  requestOptions: IHubRequestOptions;
  /**
   * The scope of the search. Must have targetEntity of "item"
   */
  scope: IQuery;
  /**
   * Which layer within the entity should be searched. Required for "connected" associations
   */
  layerId?: string;
  /**
   * The number of results to return
   */
  num?: number;
}
