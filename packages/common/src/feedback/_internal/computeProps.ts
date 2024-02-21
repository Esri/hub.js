import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { computeBaseProps } from "../../core/_internal/computeBaseProps";
import { IHubFeedback } from "../../core/types/IHubFeedback";
import { IModel } from "../../types";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { isDiscussable } from "../../discussions/utils";
import { hasMapQuestion } from "../utils/has-map-question";
import { shouldDisplayMap } from "../utils/should-display-map";

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
  feedback.hasMapQuestion = hasMapQuestion(model.formJSON.questions);
  feedback.displayMap = shouldDisplayMap(model.item);

  // cast b/c this takes a partial but returns a full object
  return feedback as IHubFeedback;
}
