import type { IGroup } from "@esri/arcgis-rest-types";
import { PropertyMapper } from "../../core/_internal/PropertyMapper";
import { IHubGroup } from "../../core/types/IHubGroup";
import { getPropertyMap } from "./getPropertyMap";

/**
 * Convert a Hub Group to an IGroup
 * @param hubGroup
 */

export function convertHubGroupToGroup(hubGroup: IHubGroup): IGroup {
  // take the _join props and map them to isInvitationOnly and autoJoin
  switch (hubGroup._join) {
    case "invite":
      hubGroup.isInvitationOnly = true;
      hubGroup.autoJoin = false;
      break;
    case "request":
      hubGroup.isInvitationOnly = false;
      hubGroup.autoJoin = false;
      break;
    case "auto":
      hubGroup.isInvitationOnly = false;
      hubGroup.autoJoin = true;
      break;
  }

  const mapper = new PropertyMapper<Partial<IHubGroup>, IGroup>(
    getPropertyMap()
  );
  const group = mapper.entityToStore(
    hubGroup,
    {} as unknown as IGroup
  ) as IGroup;
  // convert isSharedUpdate to the updateitemcontrol capability
  if (hubGroup.isSharedUpdate) {
    group.capabilities = "updateitemcontrol";
  }
  // convert the values for membershipAccess back to
  // the ones the API accepts
  if (group.membershipAccess === "organization") {
    group.membershipAccess = "org";
  }
  if (group.membershipAccess === "collaborators") {
    group.membershipAccess = "collaboration";
  }
  // since we are setting null to a prop, we need to
  // send clearEmptyFields: true to the updateGroup call
  if (group.membershipAccess === "anyone") {
    group.membershipAccess = "";
    group._clearEmptyFields = true;
  }
  return group;
}
