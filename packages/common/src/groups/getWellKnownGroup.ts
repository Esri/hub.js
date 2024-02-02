import { WellKnownGroups } from "./_internal/WellKnownGroups";
import { cloneObject } from "../util";
import { IHubGroup } from "../core/types/IHubGroup";

/**
 * Fetches a well known group template based on a name
 *
 * TODO: This should be expanded to check for privs and further flesh out
 * group templates. See wellKnownTeams for how we've handled it in the past
 *
 * @param groupType String of the group type to get
 * @returns Group template
 */
export function getWellKnownGroup(
  groupType: keyof typeof WellKnownGroups
): Partial<IHubGroup> {
  // return the group by name
  return cloneObject(WellKnownGroups[groupType]);
}
