import { encode } from "base-64";
import { IPageResponse } from "./paginator";

interface IContentPageStart {
  hub: number;
  ago: number;
}

interface IContentPage {
  hubAdded: number;
  agoAdded: number;
  hubTotal: number;
  agoTotal: number;
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
  const hubNextStart: number = (start.hub || 0) + (page.hubAdded || 0);
  const agoNextStart: number = (start.ago || 0) + (page.agoAdded || 0);

  const cursor = encode(
    JSON.stringify({
      hub: hubNextStart,
      ago: agoNextStart
    })
  );
  const total = (page.hubTotal || 0) + (page.agoTotal || 0);
  const hasNextPage =
    hubNextStart < page.hubTotal || agoNextStart < page.agoTotal;

  return {
    cursor,
    total,
    hasNextPage
  };
}
