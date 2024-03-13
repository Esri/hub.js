import { updateGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { MembershipAccess, SettableAccessLevel } from "../core/types/types";

/**
 * Sets the access level of the association group
 * @groupId - id of the association group
 * @access access level to set
 * @context - ArcGIS context object
 */
export async function setAssociationsGroupAccess(
  groupId: string,
  access: SettableAccessLevel,
  context: IArcGISContext
): Promise<void> {
  await updateGroup({
    group: {
      id: groupId,
      access,
    },
    authentication: context.hubRequestOptions.authentication,
  });
}

/**
 * Sets the membership access level of the association group
 * @groupId - id of the association group
 * @param membershipAccess membership access level to set
 * @context - ArcGIS context object
 */
export async function setAssociationsMembershipAccess(
  groupId: string,
  membershipAccess: MembershipAccess,
  context: IArcGISContext
): Promise<void> {
  await updateGroup({
    group: {
      id: groupId,
      membershipAccess,
    },
    authentication: context.hubRequestOptions.authentication,
  });
}
