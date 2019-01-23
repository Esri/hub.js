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
  parent_id: string;
  value_sum?: number;
  parent_id_up?: number;
  parent_id_down?: number;
}

/**
 * ```js
 * import { searchNetVotes } from "@esri/hub-annotations";
 * //
 * searchNetVotes({ url: annotationsUrl + "/0",
 *                  where=dataset_id="initiative123"})
 *   .then(response => {
 *     //   [{
 *     //     parent_id: "comment1",
 *     //     value_sum: 3
 *     //   }]
 *     // }
 *   });
 * ```
 * Query for net votes per comment from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchNetVotes(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "parent_id";
  const outStat: IStatisticDefinition = {
    statisticType: "sum",
    onStatisticField: "value",
    outStatisticFieldName: "value_sum"
  };
  requestOptions.outStatistics = [outStat];
  // excluding the original comment
  const commentExclusionClause = "value!=0";
  requestOptions.where += requestOptions.where ? "+AND+" : "";
  requestOptions.where += commentExclusionClause;

  return queryFeatures(requestOptions).then(response => {
    const data: IVoteResourceObject[] = [];

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        const attributes = statistic.attributes;

        const resource: IVoteResourceObject = {
          parent_id: attributes.parent_id,
          value_sum: attributes.value_sum
        };

        data.push(resource);
      }
    );

    return { data };
  });
}

/**
 * ```js
 * import { searchUpVotes } from "@esri/hub-annotations";
 * //
 * searchUpVotes({ url: annotationsUrl + "/0",
 *                  where=dataset_id="initiative123"})
 *   .then(response => {
 *     //   [{
 *     //     parent_id: "comment1",
 *     //     parent_id_up: 6
 *     //   }]
 *     // }
 *   });
 * ```
 * Query for net votes per comment from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchUpVotes(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "parent_id";
  const outStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "value",
    outStatisticFieldName: "parent_id_up"
  };
  requestOptions.outStatistics = [outStat];
  // counting only the up votes
  const upVotesClause = "value>0";
  requestOptions.where += requestOptions.where ? "+AND+" : "";
  requestOptions.where += upVotesClause;

  return queryFeatures(requestOptions).then(response => {
    const data: IVoteResourceObject[] = [];

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        const attributes = statistic.attributes;

        const resource: IVoteResourceObject = {
          parent_id: attributes.parent_id,
          parent_id_up: attributes.parent_id_up
        };

        data.push(resource);
      }
    );

    return { data };
  });
}

/**
 * ```js
 * import { searchDownVotes } from "@esri/hub-annotations";
 * //
 * searchDownVotes({ url: annotationsUrl + "/0",
 *                  where=dataset_id="initiative123"})
 *   .then(response => {
 *     //   [{
 *     //     parent_id: "comment1",
 *     //     parent_id_down: 3
 *     //   }]
 *     // }
 *   });
 * ```
 * Query for net votes per comment from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with summary statistics from the annotation service for a Hub enabled ArcGIS Online organization.
 */
export function searchDownVotes(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<{ data: IVoteResourceObject[] }> {
  requestOptions.groupByFieldsForStatistics = "parent_id";
  const outStat: IStatisticDefinition = {
    statisticType: "count",
    onStatisticField: "value",
    outStatisticFieldName: "parent_id_down"
  };
  requestOptions.outStatistics = [outStat];
  // counting only the down votes
  const downVotesClause = "value<0";
  requestOptions.where += requestOptions.where ? "+AND+" : "";
  requestOptions.where += downVotesClause;

  return queryFeatures(requestOptions).then(response => {
    const data: IVoteResourceObject[] = [];

    // use .reduce()?
    (response as IQueryFeaturesResponse).features.forEach(
      (statistic: IFeature) => {
        const attributes = statistic.attributes;

        const resource: IVoteResourceObject = {
          parent_id: attributes.parent_id,
          parent_id_down: attributes.parent_id_down
        };

        data.push(resource);
      }
    );

    return { data };
  });
}
