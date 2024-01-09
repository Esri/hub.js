import { HubEntityType } from "../../core/types";
import { getAssociationHierarchy } from "./getAssociationHierarchy";

/**
 * given two entity types, this util returns
 * whether or not associations are supported
 * between the two
 *
 * @param type1 - first entity type
 * @param type2 - second entity type
 * @returns {boolean}
 */
export const isAssociationSupported = (
  type1: HubEntityType,
  type2: HubEntityType
): boolean => {
  try {
    const hierarchy1 = getAssociationHierarchy(type1);
    const hierarchy2 = getAssociationHierarchy(type2);

    if (hierarchy1.children.includes(type2)) {
      return hierarchy2.parents.includes(type1);
    } else if (hierarchy1.parents.includes(type2)) {
      return hierarchy2.children.includes(type1);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
