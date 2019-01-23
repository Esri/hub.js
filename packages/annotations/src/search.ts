/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  IQueryFeaturesResponse,
  IStatisticDefinition,
  IQueryResponse
} from "@esri/arcgis-rest-feature-service";

import { getUser } from "@esri/arcgis-rest-users";
import { IGeometry, IFeature } from "@esri/arcgis-rest-common-types";
import { IAnnoFeature } from "./add";

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
 * //
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
    (response as IQueryFeaturesResponse).features.forEach(
      (comment: IFeature, index: number) => {
        const attributes = comment.attributes;
        const geometry = comment.geometry;

        const resource: IResourceObject = {
          id:
            attributes.author === ""
              ? `AnonymousUser_${index}`
              : attributes.author,
          type: "annotations",
          attributes
        };

        if (geometry) {
          resource.geometry = geometry;
        }

        data.push(resource);

        // ensure we only fetch metadata about each user once
        if (users.indexOf(attributes.author) === -1) {
          users.push(attributes.author);
        }
      }
    );

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

export interface IVoteResourceObject {
  id: string;
  type: "votes";
  attributes: {
    upVotes: number;
    downVotes: number;
  };
}

/**
 * ```js
 * import { searchAnnotationVotes } from "@esri/hub-annotations";
 * //
 * searchAnnotationVotes({ url: annotationsUrl + "/0",
 *                         annotation: {
 *                            id: "Annotation1",
 *                            type: "annotations",
 *                            attributes: {description: "Great place!", ...}
 *                          }})
 *   .then(response => {
 *     //   data: [{
 *     //     id,
 *     //     type: "votes",
 *     //     attributes: {
 *     //       upVotes: 3,
 *     //       downVotes: 0
 *     //     }
 *     //   }]
 *    });
 * ```
 * Query for up and down votes on a comment from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @param annotation - the annotation for which votes need to be counted
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchAnnotationVotes(
  requestOptions: IQueryFeaturesRequestOptions,
  annotation: IAnnoFeature
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "value";
  const outStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "value",
    outStatisticFieldName: "value_count"
  };
  requestOptions.outStatistics = [outStat];
  // filtering for the comment
  const commentFilteringClause = "parent_id=" + annotation.attributes.id;
  requestOptions.where += requestOptions.where ? "+AND+" : "";
  requestOptions.where += commentFilteringClause;

  return queryFeatures(requestOptions).then(response => {
    const data: IVoteResourceObject[] = [];
    const resource: IVoteResourceObject = {
      id: annotation.attributes.id,
      type: "votes",
      attributes: {
        upVotes: 0,
        downVotes: 0
      }
    };

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        const attributes = statistic.attributes;
        if (statistic.attributes.value > 0) {
          resource.attributes.upVotes += statistic.attributes.value_count;
        } else if (statistic.attributes.value < 0) {
          resource.attributes.upVotes += statistic.attributes.value_count;
        }
      }
    );
    data.push(resource);
    return { data };
  });
}
