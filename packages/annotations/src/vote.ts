/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ArcGISRequestError,
  ArcGISAuthError,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import {
  addFeatures,
  deleteFeatures,
  queryFeatures,
  IAddFeaturesOptions,
  IDeleteFeaturesOptions
} from "@esri/arcgis-rest-feature-layer";

import { IAnnoFeature } from "./add";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IEditFeatureResult } from "@esri/arcgis-rest-feature-layer/dist/esm/helpers";

export interface IVoteOptions extends IRequestOptions {
  url: string;
  annotation: IAnnoFeature;
  /**
   * Set to 'true' in order to vote another annotation down.
   */
  downVote?: boolean;
  authentication: UserSession;
}

/**
 * ```js
 * import { vote } from "@esri/hub-annotations";
 * //
 * voteOnAnnotation({
 *   url,
 *   annotation: { attributes: {} },
 *   authentication
 * })
 *   .then(response);
 * ```
 * Upvote (or downvote) another annotation.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the response from the service after attempting to vote on an annotation.
 */
export function voteOnAnnotation(
  requestOptions: IVoteOptions
): Promise<
  | { addResults?: IEditFeatureResult[] }
  | { deleteResults?: IEditFeatureResult[] }
> {
  const annotation = requestOptions.annotation;
  const auth = requestOptions.authentication as UserSession;
  const url = requestOptions.url;

  if (!auth) {
    return Promise.reject(
      new ArcGISAuthError(`Voting by anonymous users is not supported.`)
    );
  }

  if (annotation.attributes.author === auth.username) {
    return Promise.reject(
      new ArcGISRequestError(`Users may not vote on their own comment/idea.`)
    );
  }

  // searchAnnotations() would make more xhrs for user metadata
  return queryFeatures({
    url,
    where: `parent_id = ${annotation.attributes.OBJECTID} AND author = '${
      auth.username
    }'`
  }).then((queryResponse: any) => {
    if (queryResponse.features.length > 0) {
      // if its a switch vote, call deleteFeatures() to remove the original
      if (
        (!requestOptions.downVote &&
          queryResponse.features[0].attributes.vote === -1) ||
        (requestOptions.downVote &&
          queryResponse.features[0].attributes.vote === 1)
      ) {
        const deleteOptions: IDeleteFeaturesOptions = {
          url,
          authentication: requestOptions.authentication,
          objectIds: [queryResponse.features[0].attributes.OBJECTID]
        };
        return (
          deleteFeatures(deleteOptions)
            // i have NO idea why the union return type is being ignored
            .then(() => {
              return {
                addResults: [
                  {
                    success: true,
                    objectId: queryResponse.features[0].attributes.OBJECTID
                  }
                ]
              };
            })
        );
      } else {
        throw new ArcGISRequestError(
          `Users may only vote on a comment/idea once.`
        );
      }
    }
    const addOptions: IAddFeaturesOptions = {
      url,
      authentication: requestOptions.authentication,
      features: [
        {
          attributes: {
            vote: requestOptions.downVote ? -1 : 1,
            parent_id: annotation.attributes.OBJECTID,
            target: annotation.attributes.target,
            description: "this is a vote.",
            status: "approved",
            source: annotation.attributes.source
          }
        }
      ]
    };
    return addFeatures(addOptions);
  });
}
