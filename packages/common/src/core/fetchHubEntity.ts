import { IArcGISContext } from "../ArcGISContext";
import { fetchInitiative } from "../initiatives";
import { fetchProject } from "../projects";
import { fetchSite } from "../sites";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";

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
    case "page":
      throw new Error(`FetchPage not implemented`);
  }
  return result;
}
