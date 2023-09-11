import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubInitiativeTemplate } from "../../core";
import { isDiscussable } from "../../discussions";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";

/**
 * Given a model and an initiative template, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param initiativeTemplate
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  initiativeTemplate: Partial<IHubInitiativeTemplate>,
  requestOptions: IRequestOptions
): IHubInitiativeTemplate {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  // thumbnail url
  initiativeTemplate.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // Handle dates
  initiativeTemplate.createdDate = new Date(model.item.created);
  initiativeTemplate.createdDateSource = "item.created";
  initiativeTemplate.updatedDate = new Date(model.item.modified);
  initiativeTemplate.updatedDateSource = "item.modified";
  initiativeTemplate.isDiscussable = isDiscussable(initiativeTemplate);

  // cast b/c this takes a partial but returns a full initiative template
  return initiativeTemplate as IHubInitiativeTemplate;
}
