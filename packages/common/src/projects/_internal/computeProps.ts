import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IHubProject } from "../../core";
import { IModel } from "../../hub-types";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { ProjectDefaultFeatures } from "./ProjectBusinessRules";
import { computeLinks } from "./computeLinks";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { upgradeCatalogSchema } from "../../search";

/**
 * Given a model and a project, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param project
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  project: Partial<IHubProject>,
  requestOptions: IRequestOptions
): IHubProject {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // compute base properties on project
  project = computeItemProps(model.item, project);
  // thumbnail url
  project.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  project.view = {
    ...model.data.view,
    featuredImageUrl: model.data.view?.featuredImageUrl,
  };
  // Ensure we have a catalog and that its at the current schema
  project.catalog = upgradeCatalogSchema(project.catalog || {});

  /**
   * Features that can be disabled by the entity owner
   */
  project.features = processEntityFeatures(
    model.data.settings?.features || {},
    ProjectDefaultFeatures
  );

  project.links = computeLinks(model.item, requestOptions);

  // cast b/c this takes a partial but returns a full project
  return project as IHubProject;
}
