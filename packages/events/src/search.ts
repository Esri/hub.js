/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse
} from "@esri/arcgis-rest-feature-service";
import { IGeometry, IFeature } from "@esri/arcgis-rest-common-types";
import { getItem } from "@esri/arcgis-rest-items";

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
 *
 * // event types are "upcoming" | "past" | "cancelled" | "draft"
 * const searchOptions: IQueryFeaturesRequestOptions = getEventQueryFromType("upcoming", {
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
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IEventResourceObject[]; included: IEventResourceObject[] }> {
  const queryOptions: IQueryFeaturesRequestOptions = {
    returnGeometry: true,
    ...requestOptions
  };

  return queryFeatures(queryOptions).then(response => {
    // if authentication is passed, get a reference to the token to tack onto image urls
    if (queryOptions.authentication) {
      return queryOptions.authentication
        .getToken(queryOptions.url)
        .then(token => {
          return formatEventResponse(
            (response as IQueryFeaturesResponse).features,
            queryOptions.url,
            token
          );
        });
    } else {
      return formatEventResponse(
        (response as IQueryFeaturesResponse).features,
        queryOptions.url
      );
    }
  });
}

function formatEventResponse(
  features: IFeature[],
  url: string,
  token?: string
) {
  const siteIds: string[] = [];
  const data: IEventResourceObject[] = [];
  const cacheBust = new Date().getTime();

  features.forEach(function(event) {
    const attributes = event.attributes;
    const geometry = event.geometry;
    let imageUrl = null;
    if (attributes.imageAttributes) {
      const imageAttributes = JSON.parse(attributes.imageAttributes);
      if (imageAttributes.crop) {
        imageUrl = `${url}/${attributes.OBJECTID}/attachments/${
          imageAttributes.crop
        }?v=${cacheBust}`;
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
      geometry
    });
    if (siteIds.indexOf(attributes.siteId) === -1) {
      siteIds.push(attributes.siteId);
    }
  });
  const getSiteInfo = siteIds.map(siteId => getItem(siteId));

  return Promise.all(getSiteInfo).then(siteInfo => {
    const included: IEventResourceObject[] = [];

    siteInfo.forEach(siteItem => {
      included.push({
        id: siteItem.id,
        type: `sites`,
        // passing along all the site item information would be overkill
        attributes: {
          id: siteItem.id,
          url: siteItem.url
        }
      });
    });

    return { included, data };
  });
}
