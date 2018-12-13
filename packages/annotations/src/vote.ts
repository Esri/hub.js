/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  addFeatures,
  IAddFeaturesRequestOptions,
  IAddFeaturesResult
} from "@esri/arcgis-rest-feature-service";

import { IAnnoFeature } from "./add";
import { UserSession } from "@esri/arcgis-rest-auth";
import { searchAnnotations } from "./search";

export interface IVoteRequestOptions extends IRequestOptions {
  url: string;
  annotation: IAnnoFeature;
  /**
   * Set to 'true' in order to vote another annotation down.
   */
  downVote?: boolean;
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
  requestOptions: IVoteRequestOptions
): Promise<IAddFeaturesResult> {
  const annotation = requestOptions.annotation;
  const auth = requestOptions.authentication as UserSession;
  const url = requestOptions.url;

  if (!auth) {
    throw Error(`Voting by anonymous users is not supported.`);
  }

  if (annotation.attributes.author === auth.username) {
    throw Error(`Users may not vote on their own comment/idea.`);
  }

  return searchAnnotations({
    url,
    where: `parent_id = '${annotation.attributes.OBJECTID}' AND author = '${
      auth.username
    }'`
  }).then(searchResponse => {
    // dont let folks vote on an idea more than once
    if (searchResponse.data.length > 0) {
      throw Error(`Users may only vote on a comment/idea once.`);
      // to do: allow a vote update
    }
    const options: IAddFeaturesRequestOptions = {
      url,
      features: [
        {
          attributes: {
            value: requestOptions.downVote ? -1 : 1,
            parent_id: annotation.attributes.OBJECTID,
            target: annotation.attributes.target,
            description: "this is a vote.",
            status: "approved",
            source: annotation.attributes.source
          }
        }
      ],
      authentication: requestOptions.authentication
    };
    return addFeatures(options);
  });
}
