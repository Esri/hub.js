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
  id: number | string;
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
      (comment: IFeature) => {
        const attributes = comment.attributes;
        const geometry = comment.geometry;

        const resource: IResourceObject = {
          id: attributes.OBJECTID,
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

export interface ISearchAnnoRequestOptions
  extends IQueryFeaturesRequestOptions {
  url: string;
  annotation: IAnnoFeature;
}

export interface IVoteResourceObject {
  id: number;
  type: "votes";
  attributes: {
    upVotes: number;
    downVotes: number;
  };
}

/**
 * ```js
 * import { searchSingleAnnotationVotes } from "@esri/hub-annotations";
 * //
 * searchSingleAnnotationVotes({ url: annotationsUrl + "/0",
 *                         annotation: {
 *                            id: "Annotation1",
 *                            type: "annotations",
 *                            attributes: {description: "Great place!", ...}
 *                          })
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
 * @returns A Promise that will resolve with summary statistics for the specified annotation from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchSingleAnnotationVotes(
  requestOptions: ISearchAnnoRequestOptions
): Promise<{ data: IVoteResourceObject[] }> {
  const data: IVoteResourceObject[] = [];
  const annotationId = requestOptions.annotation.attributes.OBJECTID;
  if (!annotationId || annotationId < 0) {
    return Promise.resolve({ data });
  }
  requestOptions.groupByFieldsForStatistics = "value";
  const outStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "value",
    outStatisticFieldName: "value_count"
  };
  requestOptions.outStatistics = [outStat];
  // filtering for the comment
  requestOptions.where = "parent_id=" + annotationId;
  const queryRequestOptions = requestOptions as IQueryFeaturesRequestOptions;
  return queryFeatures(queryRequestOptions).then(response => {
    const resource: IVoteResourceObject = {
      id: annotationId,
      type: "votes",
      attributes: {
        upVotes: 0,
        downVotes: 0
      }
    };

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        if (statistic.attributes.value > 0) {
          resource.attributes.upVotes += statistic.attributes.value_count;
        } else if (statistic.attributes.value < 0) {
          resource.attributes.downVotes += statistic.attributes.value_count;
        }
      }
    );
    data.push(resource);
    return { data };
  });
}

/**
 * ```js
 * import { searchAnnotationVotes } from "@esri/hub-annotations";
 * //
 * searchAllAnnotationVotes({ url: annotationsUrl + "/0"})
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
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchAllAnnotationVotes(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "parent_id";
  const votesStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "value",
    outStatisticFieldName: "count"
  };
  requestOptions.outStatistics = [votesStat];
  // filtering for up votes
  const upVoteClause = "value>0";
  requestOptions.where += requestOptions.where ? "+AND+" : "";
  requestOptions.where += upVoteClause;

  return queryFeatures(requestOptions).then(upVotesResponse => {
    const data: IVoteResourceObject[] = [];
    // use .reduce()?
    (upVotesResponse as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        const resource: IVoteResourceObject = {
          id: statistic.attributes.parent_id,
          type: "votes",
          attributes: {
            upVotes: statistic.attributes.count,
            downVotes: 0
          }
        };
        data.push(resource);
      }
    );
    // filtering for down Votes
    requestOptions.where.replace("value>0", "value<0");
    return queryFeatures(requestOptions).then(downVotesResponse => {
      // use .reduce()?
      (downVotesResponse as IQueryFeaturesResponse).features.forEach(
        (statistic: IFeature) => {
          const existingResource = data.find(
            voteR => voteR.id === statistic.attributes.parent_id
          );
          if (existingResource) {
            existingResource.attributes.downVotes = statistic.attributes.count;
          } else {
            const resource: IVoteResourceObject = {
              id: statistic.attributes.parent_id,
              type: "votes",
              attributes: {
                upVotes: 0,
                downVotes: statistic.attributes.count
              }
            };
            data.push(resource);
          }
        }
      );
      return { data };
    });
  });
}
