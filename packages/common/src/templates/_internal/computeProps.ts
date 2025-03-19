import { IRequestOptions } from "@esri/arcgis-rest-request";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { IModel } from "../../hub-types";
import { TemplateDefaultFeatures } from "./TemplateBusinessRules";
import { IHubTemplate } from "../../core/types/IHubTemplate";
import { computeLinks } from "./computeLinks";
import { getProp } from "../../objects";
import { getDeployedTemplateType } from "../utils";
import { computeItemProps } from "../../core/_internal/computeItemProps";

/**
 * @private
 * Given a model and a template, set various computed
 * properties on the template that can't be directly
 * mapped from the model
 * @param model
 * @param template
 * @param requestOptions
 */
export function computeProps(
  model: IModel,
  template: Partial<IHubTemplate>,
  requestOptions: IRequestOptions
): IHubTemplate {
  // 1. compute base properties on template
  template = computeItemProps(model.item, template);

  // 2. compute relevant template links
  template.links = computeLinks(model.item, requestOptions);

  // 3. append the template's thumbnail url at the top-level
  template.thumbnailUrl = template.links.thumbnail;

  // 6. process features that can be disabled by the entity owner
  template.features = processEntityFeatures(
    getProp(model, "data.settings.features") || {},
    TemplateDefaultFeatures
  );

  // 7. compute additional template-specific properties
  template.isDeployed = (getProp(model, "item.typeKeywords") || []).includes(
    "Deployed"
  );
  template.deployedType = getDeployedTemplateType(model.item);

  // 8. cast b/c this takes a partial but returns a full template
  return template as IHubTemplate;
}
