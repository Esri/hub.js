import { IHubGroup } from "../../core/types/IHubGroup";

interface IWellKnownGroupTemplate {
  hubViewGroup: Partial<IHubGroup>;
  hubEditGroup: Partial<IHubGroup>;
  hubFollowersGroup: Partial<IHubGroup>;
}

/**
 * Default templates for well known group types. Hub group types
 * are prefaced with `hub`. In the future we may expand this list
 * with enterprise specific groups as well
 */
export const WellKnownGroups: IWellKnownGroupTemplate = {
  /** View Groups for Envs here */
  hubViewGroup: {
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    hiddenMembers: false,
    isViewOnly: true,
    tags: ["Hub Group"],
  },
  /** End View Groups */
  /** Edit Groups for Envs here */
  hubEditGroup: {
    access: "org",
    autoJoin: false,
    isSharedUpdate: true,
    isInvitationOnly: false,
    hiddenMembers: false,
    isViewOnly: true,
    tags: ["Hub Group"],
  },
  /** End Edit Groups */
  /** Followers Groups for envs here */
  hubFollowersGroup: {
    access: "public",
    autoJoin: true,
    isInvitationOnly: false,
    isViewOnly: true,
  },
  /** End Followers Groups */
};
