import { HubEntityType } from "../../core/types";
import { getAssociationHierarchy } from "./getAssociationHierarchy";

export const isAssociationSupported = (
  type1: HubEntityType,
  type2: HubEntityType
) => {
  const hierarchy1 = getAssociationHierarchy(type1);
  const hierarchy2 = getAssociationHierarchy(type2);

  if (hierarchy1.children.includes(type2)) {
    return hierarchy2.parents.includes(type1);
  } else if (hierarchy1.parents.includes(type2)) {
    return hierarchy2.children.includes(type1);
  } else {
    return false;
  }
};
