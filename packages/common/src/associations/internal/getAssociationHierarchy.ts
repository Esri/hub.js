import { HubEntityType, IHubAssociationHierarchy } from "../..";
import { ProjectAssociationHierarchies } from "../../projects/_internal/ProjectAssociationHierarchies";
import { InitiativeAssociationHierarchies } from "../../initiatives/_internal/InitiativeAssociationHierarchies";

/**
 * given an entity type, get the parent and children
 * entity types that it can associate with
 *
 * @param type entity type
 * @returns {IHubAssociationHierarchy}
 */
export const getAssociationHierarchy = (
  type: HubEntityType
): IHubAssociationHierarchy => {
  let hierarchy: IHubAssociationHierarchy = {
    children: [],
    parents: [],
  };
  switch (type) {
    case "initiative":
      hierarchy = InitiativeAssociationHierarchies;
      break;
    case "project":
      hierarchy = ProjectAssociationHierarchies;
      break;
    // as we support more entity associations, we'll need to extend this
    default:
      throw new Error(
        `getAssociationHierarchy: Invalid type for assosiations: ${type}.`
      );
  }

  return hierarchy;
};
