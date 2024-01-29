import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubInitiativeTemplate } from "../../core";
import { isDiscussable } from "../../discussions";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { InitiativeTemplateDefaultFeatures } from "./InitiativeTemplateBusinessRules";
import { computeLinks } from "./computeLinks";
import { computeBaseProps } from "../../core/_internal/computeBaseProps";

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

  // compute base properties on initiativeTemplate
  initiativeTemplate = computeBaseProps(model.item, initiativeTemplate);

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

  /**
   * Features that can be disabled by the entity owner
   * We don't have explicit features for initiative templates yet,
   * but the groundwork is there
   */
  initiativeTemplate.features = processEntityFeatures(
    model.data.settings?.features || {},
    InitiativeTemplateDefaultFeatures
  );

  initiativeTemplate.links = computeLinks(model.item, requestOptions);

  // cast b/c this takes a partial but returns a full initiative template
  return initiativeTemplate as IHubInitiativeTemplate;
}
