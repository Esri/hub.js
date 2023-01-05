import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { processEntityCapabilities } from "../../capabilities";
import { IModel } from "../../types";
import { InitiativeDefaultCapabilities } from "./InitiativeBusinessRules";
import { IHubInitiative } from "../../core";

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

  // Handle capabilities
  initiative.capabilities = processEntityCapabilities(
    model.data.settings?.capabilities || {},
    InitiativeDefaultCapabilities
  );

  // cast b/c this takes a partial but returns a full object
  return initiative as IHubInitiative;
}
