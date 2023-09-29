import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { isDiscussable } from "../../discussions/utils";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { IModel } from "../../types";
import { TemplateDefaultFeatures } from "./TemplateBusinessRules";
import { IHubTemplate } from "../../core/types/IHubTemplate";
import { computeLinks } from "./computeLinks";

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
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  // 1. compute relevant template links
  template.links = computeLinks(model.item, requestOptions);

  // 2. append the template's thumbnail url at the top-level
  template.thumbnailUrl = template.links.thumbnail;

  // 3. compute relevant template dates
  template.createdDate = new Date(model.item.created);
  template.createdDateSource = "item.created";
  template.updatedDate = new Date(model.item.modified);
  template.updatedDateSource = "item.modified";

  // 4. determine whether the template is discussable
  template.isDiscussable = isDiscussable(template);

  // 5. process features that can be disabled by the entity owner
  template.features = processEntityFeatures(
    model.data.settings?.features || {},
    TemplateDefaultFeatures
  );

  // 6. cast b/c this takes a partial but returns a full template
  return template as IHubTemplate;
}
