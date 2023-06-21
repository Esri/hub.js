import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { DiscussionDefaultCapabilities } from "./DiscussionBusinessRules";
import { IHubDiscussion } from "../../core";
import { processEntityCapabilities } from "../../capabilities";
import { isDiscussable } from "../utils";

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
  // thumbnail url
  discussion.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // Handle Dates
  discussion.createdDate = new Date(model.item.created);
  discussion.createdDateSource = "item.created";
  discussion.updatedDate = new Date(model.item.modified);
  discussion.updatedDateSource = "item.modified";
  discussion.isDiscussable = isDiscussable(discussion);

  // Handle capabilities
  discussion.capabilities = processEntityCapabilities(
    model.data?.settings?.capabilities || {},
    DiscussionDefaultCapabilities
  );

  // cast b/c this takes a partial but returns a full object
  return discussion as IHubDiscussion;
}
