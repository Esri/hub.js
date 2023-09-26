import { IArcGISContext } from "../ArcGISContext";
import { updateContent } from "../content/edit";
import { updateDiscussion } from "../discussions/edit";
import { updateInitiative } from "../initiatives/HubInitiatives";
import { updateProject } from "../projects/edit";
import { updateSite } from "../sites/HubSites";
import { updatePage } from "../pages/HubPages";
import { updateInitiativeTemplate } from "../initiativeTemplates";
import {
  HubEntity,
  HubEntityType,
  IHubDiscussion,
  IHubEditableContent,
  IHubInitiative,
  IHubProject,
  IHubSite,
  IHubPage,
  IHubInitiativeTemplate,
} from "./types";

/**
 * centralized function to update a Hub entity - delegates
 * to the appropriate update function by entity type
 * @param type
 * @param entity
 * @param context
 * @returns
 */
export const updateHubEntity = async (
  type: HubEntityType,
  entity: HubEntity,
  context: IArcGISContext
): Promise<HubEntity> => {
  let result: HubEntity;
  switch (type) {
    case "project":
      result = await updateProject(
        entity as IHubProject,
        context.userRequestOptions
      );
      break;
    case "site":
      result = await updateSite(entity as IHubSite, context.hubRequestOptions);
      break;
    case "initiative":
      result = await updateInitiative(
        entity as IHubInitiative,
        context.userRequestOptions
      );
      break;
    case "discussion":
      result = await updateDiscussion(
        entity as IHubDiscussion,
        context.userRequestOptions
      );
      break;
    case "content":
      result = await updateContent(
        entity as IHubEditableContent,
        context.userRequestOptions
      );
      break;
    case "page":
      result = await updatePage(entity as IHubPage, context.userRequestOptions);
      break;
    case "initiativeTemplate":
      result = await updateInitiativeTemplate(
        entity as IHubInitiativeTemplate,
        context.userRequestOptions
      );
  }
  return result;
};
