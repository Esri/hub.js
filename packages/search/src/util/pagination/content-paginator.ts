import { encode } from "base-64";
import { IPageResponse } from "./paginator";

/**
 * Interface for specifying the starting page for a particular content search
 * in an AGO (non-Portal) environment, where AGO and Hub Indexer content results are combined
 * as part of returning search results
 *
 * @param hub the starting point for Hub Index content
 * @param ago the starting point for AGO (private) content
 */
interface IContentPageStart {
  hub: number;
  ago: number;
}

/**
 * Interface for specifying the number of Hub Index (hub) and AGO (ago) items
 * returned as part of the current page of search results.
 *
 * @param hubRecordsAdded the number of Hub Index records returned as part of results page
 * @param agoRecordsAdded the number of AGO records returned as part of results page
 * @param hubRecordsTotal the number of total Hub Index records to be returned as part of search
 * @param agoRecordsTotal the number of total AGO records to be returned as part of search
 */
interface IContentPage {
  hubRecordsAdded: number;
  agoRecordsAdded: number;
  hubRecordsTotal: number;
  agoRecordsTotal: number;
}

/**
 * @param start - starting cursor when perfoming current search
 * @param page - data associated with the current page of results
 * @returns an object with a stringified cursor for use in searching next page of results,
 * the total number of results, and if there are no more pages left
 *
 * Note: The signature for this could be converted to a more generic interface with two parameters:
 * start - indicates the starting point for the current search
 * page - indicates the page of the current set of reseults to use to determine the "next" starting point
 */
export function pageContent(
  start: IContentPageStart,
  page: IContentPage
): IPageResponse {
  const hubNextStart: number = (start.hub || 0) + (page.hubRecordsAdded || 0);
  const agoNextStart: number = (start.ago || 0) + (page.agoRecordsAdded || 0);

  const cursor = encode(
    JSON.stringify({
      hub: hubNextStart,
      ago: agoNextStart
    })
  );
  const total = (page.hubRecordsTotal || 0) + (page.agoRecordsTotal || 0);
  const hasNextPage =
    hubNextStart < page.hubRecordsTotal || agoNextStart < page.agoRecordsTotal;

  return {
    cursor,
    total,
    hasNextPage
  };
}
