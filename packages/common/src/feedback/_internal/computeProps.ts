import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { computeBaseProps } from "../../core/_internal/computeBaseProps";
import { isDiscussable } from "../../discussions";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { IHubFeedback } from "../../core/types/IHubFeedback";

/**
 * Given a model and a feedback object, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param feedback
 * @param requestOptions
 * @returns an IHubFeedback object
 */
export function computeProps(
  model: IModel,
  feedback: Partial<IHubFeedback>,
  requestOptions: IRequestOptions
): IHubFeedback {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // compute base properties on feedback object
  feedback = computeBaseProps(model.item, feedback);

  // thumbnail url
  feedback.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // Handle Dates
  feedback.createdDate = new Date(model.item.created);
  feedback.createdDateSource = "item.created";
  feedback.updatedDate = new Date(model.item.modified);
  feedback.updatedDateSource = "item.modified";
  feedback.isDiscussable = isDiscussable(feedback);

  // cast b/c this takes a partial but returns a full object
  return feedback as IHubFeedback;
}
