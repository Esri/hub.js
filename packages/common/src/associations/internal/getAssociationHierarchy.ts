import { HubEntityType, IHubAssociationHierarchy } from "../..";
import { ProjectAssociationHierarchies } from "../../projects/_internal/ProjectAssociationHierarchies";
import { InitiativeAssociationHierarchies } from "../../initiatives/_internal/InitiativeAssociationHierarchies";

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
    default:
      throw new Error(
        `getAssociationHierarchy: Invalid type for assosiations: ${type}.`
      );
  }

  return hierarchy;
};
