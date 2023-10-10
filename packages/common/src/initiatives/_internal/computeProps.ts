import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";

import { IModel } from "../../types";

import { IHubInitiative } from "../../core";
import { isDiscussable } from "../../discussions";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { InitiativeDefaultFeatures } from "./InitiativeBusinessRules";
import { computeLinks } from "./computeLinks";

/**
 * Given a model and an Initiative, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param initiative
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  initiative: Partial<IHubInitiative>,
  requestOptions: IRequestOptions
): IHubInitiative {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  // thumbnail url
  initiative.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // Handle Dates
  initiative.createdDate = new Date(model.item.created);
  initiative.createdDateSource = "item.created";
  initiative.updatedDate = new Date(model.item.modified);
  initiative.updatedDateSource = "item.modified";
  initiative.isDiscussable = isDiscussable(initiative);

  /**
   * Features that can be disabled by the entity owner
   */
  initiative.features = processEntityFeatures(
    model.data.settings?.features || {},
    InitiativeDefaultFeatures
  );

  initiative.links = computeLinks(model.item, requestOptions);

  // cast b/c this takes a partial but returns a full object
  return initiative as IHubInitiative;
}
