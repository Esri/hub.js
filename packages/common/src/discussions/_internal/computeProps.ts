import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";

import { IHubDiscussion } from "../../core";

import { isDiscussable } from "../utils";
import { computeItemProps } from "../../core/_internal/computeItemProps";

/**
 * Given a model and a Discussion, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param discussion
 * @param requestOptions
 * @returns an IHubDiscussion
 */
export function computeProps (
  model: IModel,
  discussion: Partial<IHubDiscussion>,
  requestOptions: IRequestOptions
): IHubDiscussion {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager = requestOptions.authentication as ArcGISIdentityManager;
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
