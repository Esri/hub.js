import { getTypeFromEntity } from "../core";
import HubError from "../HubError";
import { getOgcApiDefinition } from "./_internal/commonHelpers/getOgcApiDefinition";
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
  // TODO: make a helper function to validate the entity type
  const entityType = getTypeFromEntity(opts.entity);
  const itemBasedEntities = [
    "page",
    "site",
    "content",
    "initiative",
    "initiativeTemplate",
    "project",
    "survey",
    "template",
  ];
  if (!itemBasedEntities.includes(entityType)) {
    throw new HubError(
      "searchAssociatedContent",
      `associated content is not supported for entity type "${entityType}"`
    );
  }

  // For now, we only support searching associated content for item-based entities
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
  const api = getOgcApiDefinition(
    scope.targetEntity,
    searchOptions.requestOptions
  );
  const url = `${api.url}/collections/all/items/${hubId}/${association}`;

  return searchOgcItems(url, scope, searchOptions);
}
