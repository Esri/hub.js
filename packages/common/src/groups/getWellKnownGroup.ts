import { IHubGroup } from "../core/types/IHubGroup";
import { checkPermission } from "../permissions";
import { IArcGISContext } from "../ArcGISContext";

type WellKnownGroup = "hubViewGroup" | "hubEditGroup" | "hubFollowersGroup";
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
  const configs: Record<WellKnownGroup, Partial<IHubGroup>> = {
    hubViewGroup: {
      access: "org",
      autoJoin: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: true,
      tags: ["Hub Group"],
      membershipAccess: checkPermission(
        "platform:portal:user:addExternalMembersToGroup",
        context
      ).access
        ? "anyone"
        : "organization",
    },
    hubEditGroup: {
      access: "org",
      autoJoin: false,
      isSharedUpdate: true,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: true,
      tags: ["Hub Group"],
      membershipAccess: checkPermission(
        "platform:portal:user:addExternalMembersToGroup",
        context
      ).access
        ? "collaborators"
        : "organization",
    },
    hubFollowersGroup: {
      access: "public",
      autoJoin: true,
      isInvitationOnly: false,
      isViewOnly: true,
    },
  };

  return configs[groupType];
}
