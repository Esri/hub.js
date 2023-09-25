import { fetchDiscussion } from "../discussions/fetch";
import { fetchHubContent } from "../content/fetch";
import { fetchInitiative } from "../initiatives/HubInitiatives";
import { fetchPage } from "../pages/HubPages";
import { fetchProject } from "../projects/fetch";
import { fetchSite } from "../sites/HubSites";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";
import { IArcGISContext } from "../ArcGISContext";
import { fetchHubGroup } from "../groups/HubGroups";
import { fetchInitiativeTemplate } from "../initiativeTemplates";

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
    case "group":
      result = await fetchHubGroup(identifier, context.userRequestOptions);
      break;
    case "initiativeTemplate":
      result = await fetchInitiativeTemplate(
        identifier,
        context.requestOptions
      );
  }
  return result;
}
