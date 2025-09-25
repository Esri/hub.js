import type { IArcGISContext } from "../types/IArcGISContext";
import { updateContent } from "../content/edit";
import { updateDiscussion } from "../discussions/edit";
import { updateInitiative } from "../initiatives/HubInitiatives";
import { updateProject } from "../projects/edit";
import { updateSite } from "../sites/HubSites";
import { updatePage } from "../pages/HubPages";
import { updateInitiativeTemplate } from "../initiative-templates/edit";
import { updateTemplate } from "../templates/edit";
import { updateHubEvent } from "../events/edit";
import { updateHubGroup } from "../groups/HubGroups";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";
import { IHubDiscussion } from "./types/IHubDiscussion";
import { IHubEditableContent } from "./types/IHubEditableContent";
import { IHubEvent } from "./types/IHubEvent";
import { IHubGroup } from "./types/IHubGroup";
import { IHubInitiative } from "./types/IHubInitiative";
import { IHubInitiativeTemplate } from "./types/IHubInitiativeTemplate";
import { IHubPage } from "./types/IHubPage";
import { IHubProject } from "./types/IHubProject";
import { IHubSite } from "./types/IHubSite";
import { IHubTemplate } from "./types/IHubTemplate";

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
        context.hubRequestOptions
      );
      break;
    case "content":
      result = await updateContent(
        entity as IHubEditableContent,
        context.hubRequestOptions
      );
      break;
    case "page":
      result = await updatePage(entity as IHubPage, context.userRequestOptions);
      break;
    case "template":
      result = await updateTemplate(
        entity as IHubTemplate,
        context.userRequestOptions
      );
      break;
    case "initiativeTemplate":
      result = await updateInitiativeTemplate(
        entity as IHubInitiativeTemplate,
        context.userRequestOptions
      );
      break;
    case "group":
      result = await updateHubGroup(entity as IHubGroup, context);
      break;
    case "event":
      result = await updateHubEvent(
        entity as IHubEvent,
        context.hubRequestOptions
      );
      break;
  }
  return result;
};
