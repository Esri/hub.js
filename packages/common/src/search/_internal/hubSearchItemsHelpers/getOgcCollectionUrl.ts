import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";

export function getOgcCollectionUrl(query: IQuery, options: IHubSearchOptions) {
  const apiDefinition = options.api as IApiDefinition;
  const collectionId = query.wellKnownQueryId;
  return collectionId
    ? `${apiDefinition.url}/collections/${collectionId}`
    : `${apiDefinition.url}/collections/all`;
}
