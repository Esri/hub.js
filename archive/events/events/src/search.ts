/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { queryFeatures } from "@esri/arcgis-rest-feature-service";

import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import type {
  IGeometry,
  IFeature,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
} from "@esri/arcgis-rest-feature-service";
import type {
  ArcGISIdentityManager,
  IRequestOptions,
} from "@esri/arcgis-rest-request";

export interface IEventResourceObject {
  id: number | string;
  type: "events" | "sites";
  attributes: {
    [key: string]: any;
  };
  imageUrl?: string;
  geometry?: IGeometry;
}

/**
 * ```js
 * import { getEventQueryFromType, searchEvents } from "@esri/hub-events";
 * // event types are "upcoming" | "past" | "cancelled" | "draft"
 * const searchOptions: IQueryFeaturesOptions = getEventQueryFromType("upcoming", {
 *   url: eventsUrl,
 *   authentication
 * });
 * searchEvents(searchOptions)
 *   .then(response => {
 *     // {
 *     //   data: [{
 *     //     id: "4",
 *     //     type: "events",
 *     //     attributes: {title: "Vision Zero", siteId: "CityofX", ...},
 *     //     geometry: {
 *     //       "x": -74.310680054965559,
 *     //       "y": 40.723010058860787
 *     //     }
 *     //   }],
 *     //   included: [{
 *     //     id: "CityofX",
 *     //     type: "sites",
 *     //     attributes: { id: "CityofX", url: "https://foo/bar"}
 *     //   }]
 *     // }
 *   });
 * ```
 * Query for events from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with decorated features from the event feature service for a Hub enabled ArcGIS Online organization.
 */
export function searchEvents(
  requestOptions: IQueryFeaturesOptions
): Promise<{ data: IEventResourceObject[]; included: IEventResourceObject[] }> {
  const queryOptions: IQueryFeaturesOptions = {
    returnGeometry: true,
    ...requestOptions,
  };

  return queryFeatures(queryOptions).then((response) => {
    if ((response as IQueryFeaturesResponse).features.length <= 0) {
      return {
        data: [] as IEventResourceObject[],
        included: [] as IEventResourceObject[],
      };
    }
    // if authentication is passed, get a reference to the token to tack onto image urls
    const authentication = queryOptions.authentication as ArcGISIdentityManager;
    if (authentication) {
      return authentication.getToken(queryOptions.url).then((token) => {
        return buildEventResponse(
          (response as IQueryFeaturesResponse).features,
          queryOptions.url,
          requestOptions as IRequestOptions,
          token
        );
      });
    } else {
      return buildEventResponse(
        (response as IQueryFeaturesResponse).features,
        queryOptions.url,
        requestOptions as IRequestOptions
      );
    }
  });
}

function buildEventResponse(
  features: IFeature[],
  url: string,
  requestOptions: IRequestOptions,
  token?: string
) {
  const siteIds: string[] = [];
  const data: IEventResourceObject[] = [];
  const included: IEventResourceObject[] = [];
  const cacheBust = new Date().getTime();
  let siteSearchQuery = "";

  features.forEach(function (event) {
    const attributes = event.attributes;
    const geometry = event.geometry;
    let imageUrl = null;
    if (attributes.imageAttributes) {
      const imageAttributes = JSON.parse(attributes.imageAttributes);
      if (imageAttributes.crop) {
        imageUrl = `${url}/${attributes.OBJECTID}/attachments/${imageAttributes.crop}?v=${cacheBust}`;
        if (token) {
          imageUrl += `&token=${token}`;
        }
      }
    }
    data.push({
      id: attributes.OBJECTID,
      type: "events",
      imageUrl,
      attributes,
      geometry,
    });
    const currentEventSiteId = attributes.siteId;
    if (
      currentEventSiteId != null &&
      siteIds.indexOf(currentEventSiteId) === -1
    ) {
      siteIds.push(currentEventSiteId);
      siteSearchQuery += siteSearchQuery.length > 0 ? " OR id:" : "id:";
      siteSearchQuery += currentEventSiteId;
    }
  });
  if (siteIds.length === 0) {
    return { included, data };
  }
  // search for site items and include those in the response
  const searchRequestOptions = requestOptions as ISearchOptions;
  searchRequestOptions.q = siteSearchQuery;
  return searchItems(searchRequestOptions).then(function (siteInfo) {
    siteInfo.results.forEach((siteItem) => {
      included.push({
        id: siteItem.id,
        type: `sites`,
        // passing along all the site item information would be overkill
        attributes: {
          id: siteItem.id,
          url: siteItem.url,
        },
      });
    });

    return { included, data };
  });
}
