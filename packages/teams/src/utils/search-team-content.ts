import {
  searchGroupContent,
  ISearchResult,
  ISearchGroupContentOptions
} from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-types";
/**
 * Get the content of a team
 * @param hubRequestOptions
 * @returns
 */
export function searchTeamContent(
  hubRequestOptions: ISearchGroupContentOptions
): Promise<ISearchResult<IItem>> {
  return searchGroupContent(hubRequestOptions);
}
