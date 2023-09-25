import { EntityType } from "../../search/types/IHubCatalog";
import { AssociationType } from "../types";

/**
 * Get the entity item type for an association type
 * @param type
 * @returns
 */
export function getTargetEntityFromAssociationType(
  type: AssociationType
): EntityType {
  let entityType: EntityType = "item";

  switch (type) {
    case "initiative":
      entityType = "item";
      break;
    // as we add more association types we need to extend this hash
    default:
      throw new Error(
        `getTargetEntityFromAssociationType: Invalid association type ${type}.`
      );
  }
  return entityType;
}
