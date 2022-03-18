import { ISearchParams } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { ISearchResult, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { encodeAgoQuery } from "./encode-ago-query";
import { getProp, chunkArray } from "@esri/hub-common";

const MAX_COUNTFIELDS = 3;

// Search for Items in ArcGIS and return raw ago response
export async function getItems(
  params: ISearchParams,
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<ISearchResult<IItem>> {
  const agoParams = encodeAgoQuery(params);
  if (agoParams.countFields) {
    const chunkedCountFields = chunkArray(
      agoParams.countFields.split(","),
      MAX_COUNTFIELDS
    ).map((fieldArrayChunk) => fieldArrayChunk.join(","));
    const promises = chunkedCountFields.map((chunk) => {
      const countFields = chunk;
      return searchItems({
        ...agoParams,
        params: {
          // NOTE: we shouldn't need this since we pass in authentication below
          token,
          countFields,
          countSize: agoParams.countSize,
        },
        countFields,
        portal,
        authentication,
        httpMethod: "POST",
      });
    });
    const responses = await Promise.all(promises);
    let allCounts: Array<{
      fieldName: string;
      fieldValues: Array<{
        value: any;
        count: number;
      }>;
    }> = [];

    for (const response of responses) {
      const counts = getProp(response, "aggregations.counts") || [];
      allCounts = allCounts.concat(counts);
    }

    responses[0].aggregations = {
      counts: allCounts,
    };

    return responses[0];
  } else {
    return searchItems({
      ...agoParams,
      params: {
        // NOTE: we shouldn't need this since we pass in authentication below
        token,
      },
      portal,
      httpMethod: "POST",
      authentication,
    });
  }
}
