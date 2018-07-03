/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

import {
  IQueryFeaturesRequestOptions,
  queryFeatures
} from "@esri/arcgis-rest-feature-service";

import { IItem } from "@esri/arcgis-rest-common-types";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";

import { getUser } from "@esri/arcgis-rest-users";

export interface IAnnoSearchResult extends ISearchResult {
  results: IAnnoItem[];
}

export interface IAnnoItem extends IItem {
  // overrides url?: string
  url: string;
}

/**
 * Fetch the annotations associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an annotations url for a Hub enabled ArcGIS Online organization.
 */
export function getAnnotationServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return searchItems({
    searchForm: { q: `typekeywords:hubAnnotationLayer AND orgid:${orgId}` },
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    const annoResponse = response as IAnnoSearchResult;
    if (annoResponse.results && annoResponse.results.length > 0) {
      // this will need to be smarter if there is more than one service
      let url = annoResponse.results[0].url;
      // force https
      url = url.replace(/^http:/gi, "https:");
      // it feels like we can/should += '/0' internally here
      return url;
    } else {
      throw Error(
        "No annotation service found. Commenting is likely not enabled."
      );
    }
  });
}

/**
 * Query for annotations from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with decorated features from the annotation service for a Hub enabled ArcGIS Online organization.
 */

export function searchAnnotations(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<any /* make it a type */> {
  return queryFeatures(requestOptions).then(response => {
    const users: string[] = [];

    if (response.features && response.features.length > 0) {
      response.features.forEach(function(comment) {
        if (users.indexOf(comment.attributes.author) === -1) {
          users.push(comment.attributes.author);
        }
      });
    }

    const getUserInfo = users.map(name => getUser(name));

    return Promise.all(getUserInfo).then(values => {
      return { users: values, features: response.features };
    });

    /*
      {
        features: [],
        users: [] // guaranteed to be unique
      }
      */
  });
}
