import { HubEntity } from "../core/types/HubEntity";
import { IHubRequestOptions } from "../hub-types";
import HubError from "../HubError";
import { getOgcApiDefinition } from "./_internal/commonHelpers/getOgcApiDefinition";
import { formatOgcItemsResponse } from "./_internal/hubSearchItemsHelpers/formatOgcItemsResponse";
import { getOgcItemQueryParams } from "./_internal/hubSearchItemsHelpers/getOgcItemQueryParams";
import { IOgcItemsResponse } from "./_internal/hubSearchItemsHelpers/interfaces";
import { ogcApiRequest } from "./_internal/hubSearchItemsHelpers/ogcApiRequest";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
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
  const searchOptions: IHubSearchOptions = {
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
  const api = getOgcApiDefinition(scope.targetEntity, searchOptions);
  const url = `${api.url}/collections/all/items/${hubId}/${association}`;

  // Build query params
  const queryParams = getOgcItemQueryParams(scope, searchOptions);

  // Make the API request
  const rawResponse: IOgcItemsResponse = await ogcApiRequest(
    url,
    queryParams,
    searchOptions
  );

  // Return formatted the response
  // NOTE: We're not currently allowing pagination, so we manually remove the "next" link
  rawResponse.links = rawResponse.links.filter((link) => link.rel !== "next");
  return formatOgcItemsResponse(rawResponse, scope, searchOptions);
}
