/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Fetch the events service associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an events url for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return searchItems({
    searchForm: { q: `typekeywords:hubEventsLayer AND orgid:${orgId}` },
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    const eventResponse = response as ISearchResult;
    if (eventResponse.results && eventResponse.results.length > 0) {
      let result;
      /* istanbul ignore else  */
      if (eventResponse.results.length === 1) {
        // user only has access to the public view
        result = eventResponse.results[0];
      } else if (eventResponse.results.length > 1) {
        // the user has access to the org view and/or the admin view
        // identify which is which
        const obj = eventResponse.results.reduce((acc: any, item: any) => {
          if (!item.typeKeywords.includes("View Service")) {
            acc.admin = item;
          } else {
            if (item.access === "public") {
              acc.public = item;
            } else {
              acc.org = item;
            }
          }
          return acc;
        }, {});
        // pick the highest access level that this user has access to
        result = obj.admin || obj.org || /* istanbul ignore next */ obj.public;
      }
      // single-layer service
      let url = `${result.url}/0`;
      // force https
      url = url.replace(/^http:/gi, "https:");
      return url;
    } else {
      throw Error("No events service found. Events are likely not enabled.");
    }
  });
}

/**
 * Get the events query based on type.
 * @param type - string to indicate event type with the options `upcoming`, `past`, `cancelled` and `draft`
 * @param params - query features request options
 * @returns an IQueryFeaturesRequestOptions that has the same values as `params` but for the modified Where and OrderBy properties
 */
export function getEventQueryFromType(
  type: string,
  params: IQueryFeaturesRequestOptions
): IQueryFeaturesRequestOptions {
  // this allows us to ask for type === upcoming | past | cancelled | draft
  // and get an appropriate `where` and `orderByFields`
  let typeWhere;
  const newParams = Object.assign({}, params);
  if (type === "cancelled") {
    if (!params.orderByFields) {
      // if orderByFields was passed in, use it, otherwise use appropriate one for cancelled
      newParams.orderByFields = "EditDate DESC";
    }
    typeWhere = `isCancelled=1 AND status<>'draft'`;
  } else if (type === "draft") {
    if (!params.orderByFields) {
      newParams.orderByFields = "EditDate DESC";
    }
    const session = params.authentication as UserSession;
    const user = session ? session.username : null;
    typeWhere = `Creator = '${user}' AND status = 'draft'`;
  } else {
    if (!params.orderByFields) {
      // if orderByFields was passed in, use it, otherwise use appropriate one for type
      newParams.orderByFields =
        type === "upcoming" ? "startDate ASC" : "startDate DESC";
    }
    const operator = type === "upcoming" ? ">" : "<=";
    typeWhere = `endDate${operator}CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'`;
  }
  if (params.where) {
    newParams.where = params.where + ` AND ${typeWhere}`;
  } else {
    newParams.where = typeWhere;
  }
  return newParams;
}
