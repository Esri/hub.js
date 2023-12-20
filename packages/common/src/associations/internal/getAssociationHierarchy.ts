import { HubEntityType } from "../../core/types";
import { IHubAssociationHierarchy } from "../../associations/types";
import { ProjectAssociationHierarchies } from "../../projects/_internal/ProjectAssociationHierarchies";
import { InitiativeAssociationHierarchies } from "../../initiatives/_internal/InitiativeAssociationHierarchies";

/**
 * associations are hierarchical in nature, e.g.
 * there is always a parent and a child involved
 * in the relationship.
 *
 * given an entity type, this util returns the
 * parent and children entity types that it can
 * associate with
 *
 * @param type - entity type
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
