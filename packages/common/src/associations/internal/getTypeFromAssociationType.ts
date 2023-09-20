import { AssociationType } from "../types";

/**
 * Get the item type for an association type
 * @param type
 * @returns
 */
export function getTypeFromAssociationType(type: AssociationType) {
  let itemType = "Hub Initiative";
  switch (type) {
    case "initiative":
      itemType = "Hub Initiative";
      break;
    // as we add more association types we need to extend this hash
    default:
      throw new Error(
        `getTypeFromAssociationType: Invalid association type ${type}.`
      );
  }
  return itemType;
}
