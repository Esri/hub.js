import {
  IHubRequestOptions,
  getHubProduct,
  getCulture,
  convertToWellKnownLocale,
  fetchHubTranslation
} from "@esri/hub-common";
import { getUserCreatableTeams } from "./utils/get-user-creatable-teams";
import { _createTeamGroups } from "./utils/_create-team-groups";
import { HubTeamType } from "./types";
import { IGroup } from "@esri/arcgis-rest-types";

/**
 * Create all the groups (aka Teams) required for a Site or Initiative
 * The group names are derived from the Site/Initiative title. Group names
 * must be unique on create, so if necessary we will increment the names
 * after translation. If you need to ADD a Team to an existing Site/Initiative,
 * use the teams-service::addTeams function
 * @param {ICreateHubTeamsOptions} createHubTeamsOptions
 */
export function createHubTeams(opts: {
  title: string;
  types: HubTeamType[];
  hubRequestOptions: IHubRequestOptions;
}): Promise<{ props: any; groups: IGroup[] }> {
  const { title, types, hubRequestOptions } = opts;
  const product = getHubProduct(hubRequestOptions.portalSelf);
  // get all the groups that this user can create in this environment
  // and filter just the team types requested
  const teamsToCreate = getUserCreatableTeams(
    hubRequestOptions.portalSelf.user,
    product
  ).filter(g => {
    return types.indexOf(g.config.type) > -1;
  });
  // get the culture out of the
  const culture = getCulture(hubRequestOptions);
  const locale = convertToWellKnownLocale(culture);
  // Fire that off
  return fetchHubTranslation(locale, hubRequestOptions.portalSelf)
    .then(translations => {
      // create the team groups
      return _createTeamGroups(
        title,
        teamsToCreate,
        translations,
        hubRequestOptions
      );
    })
    .catch(ex => {
      throw Error(`Error in team-utils::createHubTeams ${ex}`);
    });
}
