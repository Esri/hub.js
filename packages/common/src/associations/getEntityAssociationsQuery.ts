import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { HubEntity } from "../core/types/HubEntity";
import { HubEntityType } from "../core/types/HubEntityType";
import { IHubEvent } from "../core/types/IHubEvent";
import { IQuery } from "../search/types/IHubCatalog";
import { getAssociatedEntitiesQuery } from "./getAssociatedEntitiesQuery";
import { getEventAssociationsQuery } from "../events/_internal/getEventAssociationsQuery";

/**
 * Resolves the appropriate IQuery used to search for entities associated with the provided entity. The implementation
 * of associations varies between entity types. Associations between Projects & Initiatives are fairly complex and require
 * somewhat of a 2-way handshake between those entities with a group in the mix, whereas associations between Events
 * and Projects, Sites & Initiatives are much more primitive in nature. This method acts as an abstraction over those
 * implementation details and delegates to methods responsible for building an IQuery for those different associations
 * respectively. This was done to avoid a breaking change to the existing `getAssociatedEntitiesQuery` method, which
 * requires an `associationType` argument as it's second parameter, but that argument doesn't make sense for Event
 * associations.
 * @param entity An entity object
 * @param context An ArcGISContext object
 * @returns a promise that resolves the IQuery responsible for searching for the provided entity's associations
 */
export async function getEntityAssociationsQuery(
  entity: HubEntity,
  context: IArcGISContext
): Promise<IQuery> {
  const entityType = getTypeFromEntity(entity);
  let query: IQuery;
  switch (entityType) {
    case "project":
    case "initiative":
      const associationType: HubEntityType =
        entityType === "project" ? "initiative" : "project";
      query = await getAssociatedEntitiesQuery(
        entity,
        associationType,
        context
      );
      break;
    case "event":
      query = getEventAssociationsQuery(entity as IHubEvent);
      break;
    default:
      query = null;
  }
  return query;
}
