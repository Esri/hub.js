import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { IHubSurvey } from "../../core/types/IHubSurvey";
import { IModel } from "../../hub-types";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { hasMapQuestion } from "../utils/has-map-question";
import { shouldDisplayMap } from "../utils/should-display-map";

/**
 * Given a model and a Survey object, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param survey
 * @param requestOptions
 * @returns an IHubSurvey object
 */
export function computeProps(
  model: IModel,
  survey: Partial<IHubSurvey>,
  requestOptions: IRequestOptions
): IHubSurvey {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // compute base properties on survey object
  survey = computeItemProps(model.item, survey);

  // thumbnail url
  survey.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  // map props
  survey.hasMapQuestion = hasMapQuestion(model.formJSON?.questions || []);
  survey.displayMap = shouldDisplayMap(model.item);

  // cast b/c this takes a partial but returns a full object
  return survey as IHubSurvey;
}
