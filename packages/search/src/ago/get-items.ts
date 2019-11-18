import { ISearchParams } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { ISearchResult, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { encodeAgoQuery } from "./encode-ago-query";
import { getProp, chunkArray } from "@esri/hub-common";

// Search for Items in ArcGIS and return raw ago response
export async function getItems(
  params: ISearchParams,
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<ISearchResult<IItem>> {
  const agoParams = encodeAgoQuery(params);
  if (agoParams.countFields) {
    // if countFields are defined
    // AGO allows only 3 countFields at max
    const chunkedCountFields = chunkArray(
      agoParams.countFields.split(","),
      3
    ).map(fieldArrayChunk => fieldArrayChunk.join(","));
    let allCounts: Array<{
      fieldName: string;
      fieldValues: Array<{
        value: any;
        count: number;
      }>;
    }> = [];
    let results;
    for (const chunk of chunkedCountFields) {
      results = await searchItems({
        ...agoParams,
        params: {
          token,
          countFields: chunk,
          countSize: agoParams.countSize
        },
        portal,
        authentication
      });
      const counts = getProp(results, "aggregations.counts") || [];
      allCounts = allCounts.concat(counts);
    }
    results.aggregations.counts = allCounts;
    return results;
  } else {
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
}
