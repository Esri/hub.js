import { IHubGroup } from "../core/types/IHubGroup";
import { checkPermission } from "../permissions";
import type { IArcGISContext } from "../types/IArcGISContext";

type WellKnownGroup =
  | "hubGroup"
  | "hubViewGroup"
  | "hubEditGroup"
  | "hubFollowersGroup"
  | "hubAssociationsGroup";
/**
 * Fetches a well known group template based on a name
 *
 * @param groupType String of the group type to get
 * @returns Group template
 */
export function getWellKnownGroup(
  groupType: WellKnownGroup,
  context: IArcGISContext
): Partial<IHubGroup> {
  // Check permissions for sharing view groups to public or org
  // They are either the string OR false
  const hasShareGroupToPublic =
    checkPermission("platform:portal:user:shareGroupToPublic", context)
      .access && "public";
  const hasShareGroupToOrg =
    checkPermission("platform:portal:user:shareGroupToOrg", context).access &&
    "org";
  const configs: Record<WellKnownGroup, Partial<IHubGroup>> = {
    hubGroup: {
      type: "Group",
      access: "private",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "organization",
    },
    hubViewGroup: {
      type: "Group",
      access: hasShareGroupToPublic || hasShareGroupToOrg || "private",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: checkPermission(
        "platform:portal:user:addExternalMembersToGroup",
        context
      ).access
        ? "anyone"
        : "organization",
    },
    hubEditGroup: {
      type: "Group",
      access: "org",
      autoJoin: false,
      isSharedUpdate: true,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: checkPermission(
        "platform:portal:user:addExternalMembersToGroup",
        context
      ).access
        ? "collaborators"
        : "organization",
    },
    hubFollowersGroup: {
      type: "Group",
      access: "public",
      autoJoin: true,
      isInvitationOnly: false,
      isViewOnly: true,
      leavingDisallowed: false,
    },
    hubAssociationsGroup: {
      type: "Group",
      access: "public",
      autoJoin: false,
      isInvitationOnly: false,
      isViewOnly: true,
      leavingDisallowed: false,
      membershipAccess: checkPermission(
        "platform:portal:user:addExternalMembersToGroup",
        context
      ).access
        ? "anyone"
        : "organization",
      protected: true,
    },
  };

  return configs[groupType];
}
