import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IModel } from "../../hub-types";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { applyDiscussionMigrations } from "./applyDiscussionMigrations";
import { IHubDiscussion } from "../../core/types/IHubDiscussion";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";

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
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
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

  // Apply migrations
  discussion = applyDiscussionMigrations(discussion as IHubDiscussion);

  // cast b/c this takes a partial but returns a full object
  return discussion as IHubDiscussion;
}
