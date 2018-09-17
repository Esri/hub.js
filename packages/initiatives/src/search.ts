/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  searchItems,
  ISearchRequestOptions,
  ISearchResult
} from "@esri/arcgis-rest-items";

/**
 * Search for Initiatives
 *
 * @export
 * @param {ISearchRequestOptions} searchRequestOptions
 * @returns {Promise<ISearchResult>}
 */
export function searchInitiatives(
  searchRequestOptions: ISearchRequestOptions
): Promise<ISearchResult> {
  // since we are mutating the q, make a copy first...
  const opts = { ...searchRequestOptions };

  //  inject the type...
  if (opts.searchForm.q) {
    opts.searchForm.q = `${opts.searchForm.q} AND type: Hub Initiative`;
  } else {
    opts.searchForm.q = `type: Hub Initiative`;
  }

  return searchItems(opts);
}

/**
 * Search for Initiative Templates
 *
 * @export
 * @param {ISearchRequestOptions} searchRequestOptions
 * @returns {Promise<ISearchResult>}
 */
export function searchInitiativeTemplates(
  searchRequestOptions: ISearchRequestOptions
): Promise<ISearchResult> {
  // since we are mutating the q, make a copy first...
  const opts = { ...searchRequestOptions };

  // inject the type and typeKeywords
  if (opts.searchForm.q) {
    opts.searchForm.q = `${
      opts.searchForm.q
    } AND type: Hub Initiative AND typekeywords:hubInitiativeTemplate`;
  } else {
    opts.searchForm.q = `type: Hub Initiative AND typekeywords:hubInitiativeTemplate`;
  }

  return searchItems(opts);
}
