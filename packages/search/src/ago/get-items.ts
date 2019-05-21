import { ISearchParams } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { ISearchResult, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { encodeAgoQuery } from "./encode-ago-query";

// Search for Items in ArcGIS and return raw ago response
export async function getItems(
  params: ISearchParams,
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<ISearchResult<IItem>> {
  const agoParams = encodeAgoQuery(params);
  return searchItems({
    ...agoParams,
    params: {
      token,
      countFields: agoParams.countFields,
      countSize: agoParams.countSize
    },
    portal,
    authentication
  });
}
