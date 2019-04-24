import { ISearchParams } from "./params";
import { agoSearch } from "./search";
import { UserSession } from "@esri/arcgis-rest-auth";
import { hubTypeLookup } from "./hub-type-map";

/**
 * Request the collection stats from AGO based on the input search
 * parameters and return search categories with a "hasContent" key
 * Example:
 * Input: { q: 'crime', tags: 'a,b,c', sort: 'name' }
 * Output: 'q=crime&tags=all(a,b,c)&sort=name'
 *
 * @export
 * @param {ISearchParams} params
 * @param {UserSession} authentication
 * @returns {any}
 */
export async function itemSearchCategories(
  params: ISearchParams,
  authentication: UserSession
): Promise<any> {
  params.countFields = params.countFields || "type";
  params.countSize = params.countSize || 200;
  const results = await agoSearch(params, authentication);
  const typeStats = results.aggregations.counts[0].fieldValues;
  const allCollections = typeStats.reduce((collections: any[], t: any) => {
    return collections.concat(hubTypeLookup(t.value));
  }, []);
  return allCollections;
}
