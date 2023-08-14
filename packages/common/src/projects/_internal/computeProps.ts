import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IHubProject } from "../../core";
import { IModel } from "../../types";
import {
  ProjectDefaultCapabilities,
  ProjectDefaultFeatures,
} from "./ProjectBusinessRules";
import { processEntityCapabilities } from "../../capabilities";
import { isDiscussable } from "../../discussions";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";

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
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  project.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  // Handle Dates
  project.createdDate = new Date(model.item.created);
  project.createdDateSource = "item.created";
  project.updatedDate = new Date(model.item.modified);
  project.updatedDateSource = "item.modified";
  project.isDiscussable = isDiscussable(project);

  // Handle capabilities
  // TODO: Remove capabilities
  project.capabilities = processEntityCapabilities(
    model.data.settings?.capabilities || {},
    ProjectDefaultCapabilities
  );

  /**
   * Features that can be disabled by the entity owner
   */
  project.features = processEntityFeatures(
    model.data.settings?.features || {},
    ProjectDefaultFeatures
  );

  // cast b/c this takes a partial but returns a full project
  return project as IHubProject;
}
