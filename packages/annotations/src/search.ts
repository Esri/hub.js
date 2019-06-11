/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IQueryFeaturesOptions,
  queryFeatures,
  IQueryFeaturesResponse,
  IStatisticDefinition
} from "@esri/arcgis-rest-feature-layer";

import { getUser } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IGeometry, IFeature } from "@esri/arcgis-rest-types";
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
  requestOptions: IQueryFeaturesOptions
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

  // upvotes and downvotes should not be returned
  requestOptions.where += " AND parent_id IS NULL";

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
      .map(name => {
        return getUser({
          username: name,
          authentication: requestOptions.authentication as UserSession
        }).catch(() => null);
      });

    return Promise.all(getUserInfo).then(userInfo => {
      const included: IResourceObject[] = [];

      userInfo.forEach(attributes => {
        if (!attributes) {
          return;
        }
        included.push({ id: attributes.username, type: `users`, attributes });
      });

      return { included, data };
    });
  });
}

export interface ISearchAnnoOptions extends IQueryFeaturesOptions {
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
 *   annotation: {
 *     id: "Annotation1",
 *     type: "annotations",
 *     attributes: { description: "Great place!", ... }
 *   }).then(response => {
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
 * Query for up and down votes on a single annotation from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @param annotation - the annotation for which votes need to be counted
 * @returns A Promise that will resolve with summary statistics for the specified annotation from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchSingleAnnotationVotes(
  requestOptions: ISearchAnnoOptions
): Promise<{ data: IVoteResourceObject[] }> {
  const data: IVoteResourceObject[] = [];
  const annotationId = requestOptions.annotation.attributes.OBJECTID;
  if (!annotationId || annotationId < 0) {
    return Promise.resolve({ data });
  }
  requestOptions.groupByFieldsForStatistics = "vote";
  const outStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "vote",
    outStatisticFieldName: "vote_count"
  };
  requestOptions.outStatistics = [outStat];
  // filtering for the comment
  requestOptions.where = "parent_id=" + annotationId;
  const queryRequestOptions = requestOptions as IQueryFeaturesOptions;
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
        if (statistic.attributes.vote > 0) {
          resource.attributes.upVotes += statistic.attributes.vote_count;
        } else if (statistic.attributes.vote < 0) {
          resource.attributes.downVotes += statistic.attributes.vote_count;
        }
      }
    );
    data.push(resource);
    return { data };
  });
}

/**
 * ```js
 * import { searchAllAnnotationVotes } from "@esri/hub-annotations";
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
 * Query for up and down votes on all annotations (with or without additional filters) from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchAllAnnotationVotes(
  requestOptions: IQueryFeaturesOptions
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "parent_id";
  const votesStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "vote",
    outStatisticFieldName: "count"
  };
  requestOptions.outStatistics = [votesStat];
  // filtering for up votes
  const upVoteClause = "vote > 0";
  requestOptions.where += requestOptions.where ? " AND " : "";
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
    requestOptions.where.replace("vote > 0", "vote < 0");
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
