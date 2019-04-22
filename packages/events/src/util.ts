/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchItems, ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { IQueryFeaturesOptions } from "@esri/arcgis-rest-feature-layer";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getHubApiUrl } from "@esri/hub-common";

/**
 * ```js
 * import { request } from "@esri/arcgis-rest-request";
 * import { getEventServiceUrl } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getEventServiceUrl(response.id)
 *       .then(url)
 *          // "https://hub.arcgis.com/api/v3/events/<orgId>..."
 *   })
 * ```
 * Get the Hub REST API endpoint to use for an organization's events
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the events API url for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return getEventServiceItem(orgId, requestOptions).then(response => {
    const host = getHubApiUrl(requestOptions);

    // Extract the Event service's view name; the view returned depends
    // on permission level of request user
    const view = response.url.match(/services\/(.*?)\/FeatureServer/);

    // Generate a root url for the hub-indexer event routes
    /* istanbul ignore else */
    if (view[1]) {
      return `${host}/api/v3/events/${orgId}/${view[1]}/FeatureServer/0`;
    }
  });
}

/**
 * ```js
 * import { request } from "@esri/arcgis-rest-request";
 * import { getEventFeatureServiceUrl } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getEventFeatureServiceUrl(response.id)
 *       .then(url)
 *         // "https://services.arcgis.com/<orgId>/arcgis/rest/services/..."
 *   })
 * ```
 * Fetch the events feature service/view for the Hub organization and given authorization.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the events feature service url for a Hub enabled ArcGIS Online organization.
 */
export function getEventFeatureServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return getEventServiceItem(orgId, requestOptions).then(response => {
    // single-layer service
    let url = `${response.url}/0`;
    // force https
    url = url.replace(/^http:/gi, "https:");
    return url;
  });
}

/**
 * Get the events query based on type.
 * @param type - string to indicate event type with the options `upcoming`, `past`, `cancelled` and `draft`
 * @param options - query features request options
 * @returns an IQueryFeaturesOptions that has the same values as `options` but for the modified Where and OrderBy properties
 */
export function getEventQueryFromType(
  type: "upcoming" | "past" | "cancelled" | "draft",
  options: IQueryFeaturesOptions
): IQueryFeaturesOptions {
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
 * import { getEventServiceItem } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getEventServiceItem(response.id)
 *       .then(itemResponse)
 *   })
 * ```
 * Fetch the events service associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the events item for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceItem(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<IItem> {
  return searchItems({
    q: `typekeywords:hubEventsLayer AND orgid:${orgId}`,
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    const eventResponse = response as ISearchResult<IItem>;
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
      return result;
    } else {
      throw Error("No events service found. Events are likely not enabled.");
    }
  });
}
