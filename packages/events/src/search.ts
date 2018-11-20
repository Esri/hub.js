/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse
} from "@esri/arcgis-rest-feature-service";

import { getItem } from "@esri/arcgis-rest-items";

export interface IEventResourceObject {
  id: string;
  type: "events" | "sites";
  attributes: {
    [key: string]: any;
  };
}

/**
 * ```js
 * import { searchEvents } from "@esri/hub-events";
 * // by default, all annotations will be retrieved
 * searchEvents({ url: eventsUrl + "/0" })
 *   .then(response => {
 *     // {
 *     //   data: [{
 *     //     id: "Site1",
 *     //     type: "events",
 *     //     attributes: {title: "Vision Zero", ...}
 *     //   }],
 *     //   included: [{
 *     //     id: "Site1",
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
export function searchAnnotations(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IEventResourceObject[]; included: IEventResourceObject[] }> {
  return queryFeatures(requestOptions).then(response => {
    const siteIds: string[] = [];
    const data: IEventResourceObject[] = [];
    const cacheBust = new Date().getTime();
    return requestOptions.authentication
      .getToken(requestOptions.url)
      .then(token => {
        (response as IQueryFeaturesResponse).features.forEach(function(event) {
          const attributes = event.attributes;
          attributes.imageUrl = "";
          if (attributes.imageAttributes) {
            const imageAttributes = JSON.parse(attributes.imageAttributes);
            if (imageAttributes.crop) {
              attributes.imageUrl = `${requestOptions.url}/${
                attributes.OBJECTID
              }/attachments/${imageAttributes.crop}?v=${cacheBust}`;
              if (token) {
                attributes.imageUrl += `&token=${token}`;
              }
            }
          }
          data.push({
            id: attributes.OBJECTID,
            type: "events",
            attributes
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
      });
  });
}
