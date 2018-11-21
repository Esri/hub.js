/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse
} from "@esri/arcgis-rest-feature-service";

import { getUser } from "@esri/arcgis-rest-users";
import { IGeometry } from "@esri/arcgis-rest-common-types";

export interface IResourceObject {
  id: string;
  type: "annotations" | "users";
  attributes: {
    [key: string]: any;
  };
  geometry?: IGeometry;
}

/**
 * ```js
 * import { searchAnnotations } from "@esri/hub-annotations";
 *
 * searchAnnotations({ url: annotationsUrl + "/0" })
 *   .then(response => {
 *     // {
 *     //   data: [{
 *     //     id: "User1",
 *     //     type: "annotations",
 *     //     attributes: {description: "Great place!", ...}
 *     //   }],
 *     //   included: [{
 *     //     id: "User1",
 *     //     type: "users",
 *     //     attributes: { firstName: "User", lastName: "Name", ...}
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
): Promise<{ data: IResourceObject[]; included: IResourceObject[] }> {
  if (!requestOptions.outFields) {
    requestOptions.outFields = [
      "OBJECTID",
      "author",
      "updater",
      "created_at",
      "updated_at",
      "description",
      "source",
      "status",
      "target",
      "dataset_id"
    ];
  }

  return queryFeatures(requestOptions).then(response => {
    const users: string[] = [];
    const data: IResourceObject[] = [];

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(function(comment) {
      const attributes = comment.attributes;
      const geometry = comment.geometry;

      const resource: IResourceObject = {
        id: attributes.author,
        type: "annotations",
        attributes
      };

      if (geometry) {
        resource["geometry"] = geometry;
      }

      data.push(resource);

      // ensure we only fetch metadata about each user once
      if (users.indexOf(attributes.author) === -1) {
        users.push(attributes.author);
      }
    });

    const getUserInfo = users
      .filter(name => name !== "") // filter out anonymous comments
      .map(name => getUser(name));

    return Promise.all(getUserInfo).then(userInfo => {
      const included: IResourceObject[] = [];

      userInfo.forEach(attributes => {
        included.push({ id: attributes.username, type: `users`, attributes });
      });

      return { included, data };
    });
  });
}
