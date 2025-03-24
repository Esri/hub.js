import {
  searchGroupContent,
  ISearchResult,
  ISearchGroupContentOptions,
} from "@esri/arcgis-rest-portal";
import type { IItem } from "@esri/arcgis-rest-types";
/**
 * Get the content of a team
 * @param {ISearchGroupContentOptions} searchOptions
 * @returns {Promise<ISearchResult<IItem>>}
 */
export function searchTeamContent(
  searchOptions: ISearchGroupContentOptions
): Promise<ISearchResult<IItem>> {
  return searchGroupContent(searchOptions);
}
