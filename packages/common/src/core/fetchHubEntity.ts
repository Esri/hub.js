import { fetchDiscussion } from "../discussions/fetch";
import { fetchHubContent } from "../content/fetch";
import { fetchInitiative } from "../initiatives/HubInitiatives";
import { fetchPage } from "../pages/HubPages";
import { fetchProject } from "../projects/fetch";
import { fetchSite } from "../sites/HubSites";
import { fetchTemplate } from "../templates/fetch";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";
import { IArcGISContext } from "../ArcGISContext";
import { fetchHubGroup } from "../groups/HubGroups";
import { fetchInitiativeTemplate } from "../initiative-templates/fetch";
import { fetchSurvey } from "../surveys/fetch";
import { fetchEvent } from "../events/fetch";

/**
 * Fetch a Hub entity by identifier (id or slug)
 * @param type
 * @param identifier
 * @param context
 * @returns
 */
export async function fetchHubEntity(
  type: HubEntityType,
  identifier: string,
  context: IArcGISContext
): Promise<HubEntity> {
  let result: HubEntity;
  switch (type) {
    case "project":
      result = await fetchProject(identifier, context.requestOptions);
      break;
    case "site":
      result = await fetchSite(identifier, context.hubRequestOptions);
      break;
    case "initiative":
      result = await fetchInitiative(identifier, context.requestOptions);
      break;
    case "discussion":
      result = await fetchDiscussion(identifier, context.hubRequestOptions);
      break;
    case "page":
      result = await fetchPage(identifier, context.hubRequestOptions);
      break;
    case "content":
      result = await fetchHubContent(identifier, context.requestOptions);
      break;
    case "template":
      result = await fetchTemplate(identifier, context.requestOptions);
      break;
    case "group":
      result = await fetchHubGroup(identifier, context.userRequestOptions);
      break;
    case "survey":
      result = await fetchSurvey(identifier, context.hubRequestOptions);
      break;
    case "event":
      result = await fetchEvent(identifier, context.hubRequestOptions);
      break;
    case "initiativeTemplate":
      result = await fetchInitiativeTemplate(
        identifier,
        context.requestOptions
      );
  }
  return result;
}
