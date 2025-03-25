import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../hub-types";

import { IHubDiscussion } from "../../core";

import { computeItemProps } from "../../core/_internal/computeItemProps";

/**
 * Given a model and a Discussion, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param discussion
 * @param requestOptions
 * @returns an IHubDiscussion
 */
export function computeProps(
  model: IModel,
  discussion: Partial<IHubDiscussion>,
  requestOptions: IRequestOptions
): IHubDiscussion {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // compute base properties on discussion
  discussion = computeItemProps(model.item, discussion);

  // thumbnail url
  discussion.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // cast b/c this takes a partial but returns a full object
  return discussion as IHubDiscussion;
}
