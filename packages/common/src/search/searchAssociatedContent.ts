import { HubEntity } from "../core/types/HubEntity";
import { IHubRequestOptions } from "../hub-types";
import HubError from "../HubError";
import { getOgcApiDefinition } from "./_internal/commonHelpers/getOgcApiDefinition";
import { ISearchOgcItemsOptions } from "./_internal/hubSearchItemsHelpers/interfaces";
import { searchOgcItems } from "./_internal/hubSearchItemsHelpers/searchOgcItems";
import { IHubSearchResponse, IHubSearchResult } from "./types";
import { IQuery } from "./types/IHubCatalog";

type HubAssociation = "related" | "connected";

interface ISearchAssociatedContentOptions {
  entity: HubEntity;
  association: HubAssociation;
  requestOptions: IHubRequestOptions;
  scope: IQuery;
  layerId?: string;
  num?: number;
}

export async function searchAssociatedContent(
  opts: ISearchAssociatedContentOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const { scope, requestOptions, num = 4 } = opts;
  const searchOptions: ISearchOgcItemsOptions = {
    requestOptions,
    num,
  };

  // For now, we only support searching associated content for item-based entities
  if (scope.targetEntity !== "item") {
    throw new HubError(
      "searchAssociatedContent",
      `associated content is not supported for targetEntity ${scope.targetEntity}`
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
