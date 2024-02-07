import { HubEntity, HubEntityType } from "../core/types";
import { getIdsFromKeywords } from "./internal/getIdsFromKeywords";

/**
 * The following util returns an array of ids that the provided
 * entity "references" via a typeKeyword of the form ref|<associationType>|<id>
 *
 * Note: if a specific associationType is not provided, this util
 * will return ALL the ids that the provided entity "references"
 *
 * Additional context: the model for associations is built around
 * platform capabilities. Platform imposes a limit of 128 on the
 * number of typeKeywords that can be set on an item. Since "child"
 * entities form their half of an association connection via
 * typeKeywords, we must limit the number of associations a child
 * can request or accept to far fewer than 128. For now, we are
 * imposing a limit of 50. From the application, we can then use
 * this util to determine if a child has already reached the limit
 *
 * @param entity - hub entity to extract ids from
 * @param associationType - entity type to extract reference ids for
 * @returns {string[]}
 */
export const getReferencedEntityIds = (
  entity: HubEntity,
  associationType?: HubEntityType
): string[] => {
  return getIdsFromKeywords(entity, associationType);
};
