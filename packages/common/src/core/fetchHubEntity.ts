import { fetchDiscussion } from "../discussions/fetch";
import { fetchHubContent } from "../content/fetchHubContent";
import { fetchInitiative } from "../initiatives/HubInitiatives";
import { fetchPage } from "../pages/HubPages";
import { fetchProject } from "../projects/fetch";
import { fetchSite } from "../sites/HubSites";
import { fetchTemplate } from "../templates/fetch";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";
import type { IArcGISContext } from "../types/IArcGISContext";
import { fetchHubGroup } from "../groups/HubGroups";
import { fetchInitiativeTemplate } from "../initiative-templates/fetch";
import { fetchEvent } from "../events/fetch";
import { fetchOrganization } from "../org/fetch";
import { fetchHubChannel } from "../channels/fetch";
import { fetchHubUser } from "../users/HubUsers";

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
    case "channel":
      result = await fetchHubChannel(identifier, context);
      break;
    case "page":
      result = await fetchPage(identifier, context.hubRequestOptions);
      break;
    case "content":
      result = await fetchHubContent(identifier, context.hubRequestOptions);
      break;
    case "template":
      result = await fetchTemplate(identifier, context.requestOptions);
      break;
    case "group":
      result = await fetchHubGroup(identifier, context.hubRequestOptions);
      break;
    case "event":
      result = await fetchEvent(identifier, context.hubRequestOptions);
      break;
    case "organization":
      result = await fetchOrganization(identifier, context.requestOptions);
      break;
    case "initiativeTemplate":
      result = await fetchInitiativeTemplate(
        identifier,
        context.requestOptions
      );
      break;
    case "user":
      result = await fetchHubUser(identifier, context);
  }
  return result;
}
