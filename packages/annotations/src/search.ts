/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse
} from "@esri/arcgis-rest-feature-service";

import { getUser } from "@esri/arcgis-rest-users";

export interface IResourceObject {
  id: string;
  type: "annotations" | "users";
  attributes: {
    [key: string]: any;
  };
}

/**
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
      "description",
      "source",
      "status",
      "target",
      "dataset_id",
      "created_at",
      "updated_at"
    ];
  }

  return queryFeatures(requestOptions).then(response => {
    const users: string[] = [];
    const data: IResourceObject[] = [];

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(function(comment) {
      const attributes = comment.attributes;
      data.push({
        id: attributes.author,
        type: "annotations",
        attributes
      });

      if (users.indexOf(comment.attributes.author) === -1) {
        users.push(attributes.author);
      }
    });

    const getUserInfo = users.map(name => getUser(name));

    return Promise.all(getUserInfo).then(userInfo => {
      const included: IResourceObject[] = [];

      userInfo.forEach(attributes => {
        included.push({ id: attributes.username, type: `users`, attributes });
      });

      return { included, data };
    });
  });
}
