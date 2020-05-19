import {
  IInitiativeModel,
  IHubRequestOptions,
  getProp
} from "@esri/hub-common";
import { updateGroup } from "@esri/arcgis-rest-portal";

/**
 * Update the tags on the teams after the initiative is created
 * Specifically:
 * - add  `hubInitiativeFollowers|<initiaiveId> to the followers group
 * @param {object} initiativeModel Initiative Model
 * @param {object} teams hash of teams
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _updateTeamTags(
  initiativeModel: IInitiativeModel,
  teams: any,
  hubRequestOptions: IHubRequestOptions
) {
  let prms = Promise.resolve({ success: true });
  // we have a followers group
  // TODO: COVER THIS WITH TESTS (spying wasnt working)
  /* istanbul ignore if */
  if (getProp(teams, "props.followersGroupId")) {
    // get the followers group out of the teams.groups array
    const followersGroup = teams.groups.find(
      (g: any) => g.id === teams.props.followersGroupId
    );
    // now we want to add a tag
    followersGroup.tags.push(
      `hubInitiativeFollowers|${initiativeModel.item.id}`
    );
    // now we want to fire off an update
    prms = updateGroup({
      group: followersGroup,
      authentication: hubRequestOptions.authentication
    });
  }
  return prms;
}
