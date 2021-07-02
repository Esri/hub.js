import { HubTeamType, TEAMTYPES } from "./types";

import {
  IHubRequestOptions,
  getHubProduct,
  getCulture,
  convertToWellKnownLocale,
  fetchHubTranslation,
} from "@esri/hub-common";
import { getUserCreatableTeams } from "./utils/get-user-creatable-teams";
import { _createTeamGroups } from "./utils/_create-team-groups";
import { IGroup } from "@esri/arcgis-rest-types";

/**
 * Create a single Team, using the same logic as creating multiple Teams.
 * Also allows a set of custom props to be passed in and applied to the team.
 *
 * This should be used PRIOR to creating Sites/Initiatives.
 * @param {ICreateHubTeamOptions} createHubTeamOptions
 */
export function createHubTeam(opts: {
  title: string;
  type: HubTeamType;
  props: any;
  hubRequestOptions: IHubRequestOptions;
}): Promise<{ props: any; groups: IGroup[] }> {
  const { title, type, props, hubRequestOptions } = opts;
  // validate that the type is valid...
  if (TEAMTYPES.indexOf(type) === -1) {
    throw new Error(
      `createHubTeam was passed ${type} which is not a valid type of team. Please send one of: ${TEAMTYPES.join(
        ","
      )}`
    );
  }
  // get all the groups the current user can create...
  // filter just the ones that match type...
  const product = getHubProduct(hubRequestOptions.portalSelf);
  const groupsToCreate = getUserCreatableTeams(
    hubRequestOptions.portalSelf.user,
    product,
    hubRequestOptions.portalSelf.currentVersion,
    hubRequestOptions.portalSelf.subscriptionInfo.type
  )
    .filter((g) => {
      return g.config.type === type;
    })
    .map((grp) => {
      // If props are passed in, spread them over the group object, but only if type === `team`
      if (grp.config.type === "team") {
        return Object.assign({}, grp, props);
      } else {
        return grp;
      }
    });
  // use the locale of the current user, or en-us as a fall-back
  const culture = getCulture(hubRequestOptions);
  const locale = convertToWellKnownLocale(culture);
  // Fire that off
  return fetchHubTranslation(locale, hubRequestOptions.portalSelf)
    .then((translations) => {
      // delegate to createTeamGroups
      return _createTeamGroups(
        title,
        groupsToCreate,
        translations,
        hubRequestOptions
      );
    })
    .catch((ex) => {
      throw Error(`Error in team-utils::createHubTeam ${ex}`);
    });
}
