/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse
} from "@esri/arcgis-rest-feature-service";
import { IGeometry } from "@esri/arcgis-rest-common-types";
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
 * const queryOptions: IQueryFeaturesRequestOptions = {
 *  ...eventUrlOptions,
 *  url: eventsUrl,
 * }
 * const eventType = "upcoming"; //| "past" | "cancelled" | "draft"; //(We never deal with other types in event list widget)
 * const eventOptions: IQueryFeaturesRequestOptions = getEventQueryFromType(eventType, queryOptions);
 * searchEvents({ url: eventsUrl })
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
 * Query for annotations from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with decorated features from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchEvents(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IEventResourceObject[]; included: IEventResourceObject[] }> {
  if (requestOptions.returnGeometry !== false) {
    requestOptions.returnGeometry = true;
  }
  return queryFeatures(requestOptions).then(response => {
    const siteIds: string[] = [];
    const data: IEventResourceObject[] = [];
    const cacheBust = new Date().getTime();
    return (
      requestOptions.authentication
        // TODO: what happens if there is no authentication? aka public view
        // Will getToken fail safe in that scenario?
        .getToken(requestOptions.url)
        .then(token => {
          (response as IQueryFeaturesResponse).features.forEach(function(
            event
          ) {
            const attributes = event.attributes;
            const geometry = event.geometry;
            let imageUrl = null;
            if (attributes.imageAttributes) {
              const imageAttributes = JSON.parse(attributes.imageAttributes);
              if (imageAttributes.crop) {
                imageUrl = `${requestOptions.url}/${
                  attributes.OBJECTID
                }/attachments/${imageAttributes.crop}?v=${cacheBust}`;
                // if (token) {
                imageUrl += `&token=${token}`;
                // }
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
                // not passing all site item information since that's not necessary.
                attributes: {
                  id: siteItem.id,
                  url: siteItem.url
                }
              });
            });

            return { included, data };
          });
        })
    );
  });
}
