/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  searchItems,
  ISearchOptions,
  ISearchResult,
  IItem
} from "@esri/arcgis-rest-portal";

/**
 * Search for Initiatives
 *
 * @export
 * @param {ISearchOptions} searchRequestOptions
 * @returns {Promise<ISearchResult>}
 */
export function searchInitiatives(
  searchRequestOptions: ISearchOptions
): Promise<ISearchResult<IItem>> {
  // since we are mutating the q, make a copy first...
  const opts = { ...searchRequestOptions };

  //  inject the type...
  if (opts.q) {
    opts.q = `${opts.q} AND type: Hub Initiative`;
  } else {
    opts.q = `type: Hub Initiative`;
  }

  return searchItems(opts);
}

/**
 * Search for Initiative Templates
 *
 * @export
 * @param {ISearchOptions} searchRequestOptions
 * @returns {Promise<ISearchResult>}
 */
export function searchInitiativeTemplates(
  searchRequestOptions: ISearchOptions
): Promise<ISearchResult<IItem>> {
  // since we are mutating the q, make a copy first...
  const opts = { ...searchRequestOptions };

  // inject the type and typeKeywords
  if (opts.q) {
    opts.q = `${
      opts.q
    } AND type: Hub Initiative AND typekeywords:hubInitiativeTemplate`;
  } else {
    opts.q = `type: Hub Initiative AND typekeywords:hubInitiativeTemplate`;
  }

  return searchItems(opts);
}
