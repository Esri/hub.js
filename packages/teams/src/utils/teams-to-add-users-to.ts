import { ITeamsStatus } from "../types";

/**
 * Takes array of group ids, if it is a core team, and teams status
 * and returns array of groups
 *
 * @param {array} groupIds Array of group ids
 * @param {boolean} isCoreTeam is this a core team?
 * @param {ITeamsStatus} teamsStatus status of main teams associated with site (core, content, followers)
 */
export function teamsToAddUsersTo(
  groupIds: string[],
  isCoreTeam: boolean,
  teamsStatus?: ITeamsStatus
): string[] {
  // If it's a core team && we have the teamsStatus
  if (isCoreTeam && teamsStatus) {
    (["content", "followers"] as Array<keyof ITeamsStatus>).forEach(
      (teamProp) => {
        if (teamsStatus[teamProp] && teamsStatus[teamProp].isOk) {
          groupIds.push(teamsStatus[teamProp].id);
        }
      }
    );
  }
  return groupIds;
}
