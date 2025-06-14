import { getTypeFromEntity } from "../core/getTypeFromEntity";
import {
  HUB_ITEM_ENTITY_TYPES,
  HubItemEntityType,
} from "../core/types/HubEntityType";
import HubError from "../HubError";
import { getOgcCollectionUrl } from "./_internal/hubSearchItemsHelpers/getOgcCollectionUrl";
import { ISearchOgcItemsOptions } from "./_internal/hubSearchItemsHelpers/interfaces";
import { searchOgcItems } from "./_internal/hubSearchItemsHelpers/searchOgcItems";
import {
  IHubSearchResponse,
  IHubSearchResult,
  ISearchAssociatedContentOptions,
} from "./types";

/**
 * Searches for content that is associated with a given entity.
 * Current associations supported are "related" and "connected".
 *
 * If unspecified, the number of results returned is 4.
 *
 * NOTE: only item based entities are supported for now.
 *
 * @returns Search results for the associated content
 */
export async function searchAssociatedContent(
  opts: ISearchAssociatedContentOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const { scope, requestOptions, num = 4 } = opts;
  const searchOptions: ISearchOgcItemsOptions = {
    requestOptions,
    num,
  };

  // Validate that we received an item-based entity
  const entityType = getTypeFromEntity(opts.entity) as HubItemEntityType;
  if (!HUB_ITEM_ENTITY_TYPES.includes(entityType)) {
    throw new HubError(
      "searchAssociatedContent",
      `associated content is not supported for entity type "${entityType}"`
    );
  }

  // For now, we only support searching associated items, not other types of entities
  if (scope.targetEntity !== "item") {
    throw new HubError(
      "searchAssociatedContent",
      `associated content scope does not support targetEntity "${scope.targetEntity}"`
    );
  }

  // The "connected" association requires a layerId
  if (!opts.layerId && opts.association === "connected") {
    throw new HubError(
      "searchAssociatedContent",
      `"layerId" is required for searching "connected" content`
    );
  }

  // Calculate the hubId
  const { entity, layerId } = opts;
  const hubId = layerId ? `${entity.id}_${layerId}` : entity.id;

  // Construct the OGC API URL
  const { association } = opts;
  const collectionUrl = getOgcCollectionUrl(scope, searchOptions);
  const associationUrl = `${collectionUrl}/items/${hubId}/${association}`;

  return searchOgcItems(associationUrl, scope, searchOptions);
}
