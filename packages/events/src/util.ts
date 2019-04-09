/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getHubUrl } from "@esri/hub-domains";

/**
 * ```js
 * import { request } from "@esri/arcgis-rest-request";
 * import { getEventServiceUrl } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getEventServiceUrl(response.id)
 *       .then(url)
 *   })
 * ```
 * Fetch the events service associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an events url for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return getEventServiceItems(orgId, requestOptions).then(response => {
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

      const host = getHubUrl(requestOptions);

      // Extract the Event service's view name; the view returned depends
      // on permission level of request user
      const view = result.url.match(/services\/(.*?)\/FeatureServer/);

      // Generate a root url for the hub-indexer event routes
      /* istanbul ignore else */
      if (view[1]) {
        return `${host}/api/v3/events/${orgId}/${view[1]}/FeatureServer/0`;
      }
    } else {
      throw Error("No events service found. Events are likely not enabled.");
    }
  });
}

/**
 * Get the events query based on type.
 * @param type - string to indicate event type with the options `upcoming`, `past`, `cancelled` and `draft`
 * @param options - query features request options
 * @returns an IQueryFeaturesRequestOptions that has the same values as `options` but for the modified Where and OrderBy properties
 */
export function getEventQueryFromType(
  type: "upcoming" | "past" | "cancelled" | "draft",
  options: IQueryFeaturesRequestOptions
): IQueryFeaturesRequestOptions {
  // this allows us to ask for type === upcoming | past | cancelled | draft
  // and get an appropriate `where` and `orderByFields`
  let typeWhere;
  const newOptions = Object.assign({}, options);
  if (type === "cancelled") {
    if (!options.orderByFields) {
      // if orderByFields was passed in, use it, otherwise use appropriate one for cancelled
      newOptions.orderByFields = "EditDate DESC";
    }
    typeWhere = `isCancelled=1 AND status<>'draft'`;
  } else if (type === "draft") {
    if (!options.orderByFields) {
      newOptions.orderByFields = "EditDate DESC";
    }
    const session = options.authentication as UserSession;
    const user = session ? session.username : null;
    typeWhere = `Creator = '${user}' AND status = 'draft'`;
  } else {
    if (!options.orderByFields) {
      // if orderByFields was passed in, use it, otherwise use appropriate one for type
      newOptions.orderByFields =
        type === "upcoming" ? "startDate ASC" : "startDate DESC";
    }
    const operator = type === "upcoming" ? ">" : "<=";
    typeWhere = `endDate${operator}CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'`;
  }
  if (options.where) {
    newOptions.where = `${options.where} AND ${typeWhere}`;
  } else {
    newOptions.where = typeWhere;
  }
  return newOptions;
}

/**
 * ```js
 * import { request } from "@esri/arcgis-rest-request";
 * import { getEventServiceItems } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getEventServiceItems(response.id)
 *       .then(itemResponse)
 *   })
 * ```
 * Fetch the events service associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an events url for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceItems(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<ISearchResult> {
  return searchItems({
    searchForm: { q: `typekeywords:hubEventsLayer AND orgid:${orgId}` },
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    return response;
  });
}
