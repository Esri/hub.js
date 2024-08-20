import { IHubEvent } from "../../core/types/IHubEvent";
import { IQuery } from "../../search/types/IHubCatalog";

/**
 * Builds an IQuery object used to query for entities explicitly referenced
 * by the event
 * @param entity An IHubEvent object
 * @returns An IQuery used to query for entities explicitly referenced by the event
 */
export function getEventAssociationsQuery(entity: IHubEvent): IQuery {
  let query: IQuery = null;
  if (entity.referencedContentIds.length) {
    query = {
      targetEntity: "item",
      filters: [
        {
          predicates: [{ id: entity.referencedContentIds }],
        },
      ],
    };
  }
  return query;
}
