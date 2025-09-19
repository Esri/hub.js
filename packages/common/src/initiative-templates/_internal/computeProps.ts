import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { IModel } from "../../hub-types";
import { InitiativeTemplateDefaultFeatures } from "./InitiativeTemplateBusinessRules";
import { computeLinks } from "./computeLinks";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { IHubInitiativeTemplate } from "../../core/types/IHubInitiativeTemplate";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";

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
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  // compute base properties on initiativeTemplate
  initiativeTemplate = computeItemProps(model.item, initiativeTemplate);

  // thumbnail url
  initiativeTemplate.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

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
