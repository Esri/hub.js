import {
  IModelTemplate,
  IHubRequestOptions,
  getHubProduct,
  getOrgDefaultTheme,
  getProp,
  cloneObject,
  deepSet,
  slugify,
  stripProtocol,
  addSolutionResourceUrlToAssets,
  getHubApiUrl,
} from "@esri/hub-common";
import { createHubTeams } from "@esri/hub-teams";
import { HubTeamType } from "@esri/hub-teams";
import { getPortalSiteHostname } from "./get-portal-site-hostname";
import { getPortalSiteUrl } from "./get-portal-site-url";
import { _createSiteInitiative } from "./_create-site-initiative";
import { _updateTeamTags } from "./_update-team-tags";
import { ensureUniqueDomainName } from "@esri/hub-common";
import { interpolateSite } from "./interpolate-site";

/**
 * Convert a Site Template into a Site Model
 * This will create Hub Teams and an Initiative, depending on licensing
 * and privs.
 *
 * The subdomain for the site will be constructed from the `settings.solution.title`
 * unless that contains unicode chars. In that case the initial subdomain will be `site`
 * and `ensureUniqueDomainName` will increment it as necessary (i.e. site-1, site-2 etc)
 *
 * This returns the Model that still needs to be saved!
 * @param {object} template Site Template
 * @param {object} settings Adlib interpolation hash
 * @param {object} transforms hash of transform functions
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function createSiteModelFromTemplate(
  template: IModelTemplate,
  settings: any,
  transforms: any,
  hubRequestOptions: IHubRequestOptions
) {
  // add url to the assets, ref'ing the original location
  template.assets = addSolutionResourceUrlToAssets(template, hubRequestOptions);
  // We may have templates which lack .properties so let's ensure that exists
  if (!template.item.properties) {
    template.item.properties = {};
  }

  // Kill props we don't want to roll forward if they happen to exist in the template
  [
    "customHostname",
    "externalUrl",
    "contentGroupId",
    "followersGroupId",
    "collaborationGroupId",
    "parentInitiativeId",
  ].forEach((prop) => {
    delete template.data.values[prop];
  });

  const product = getHubProduct(hubRequestOptions.portalSelf);

  let title = getProp(settings, "solution.title") || "New Site";
  // handle issue with titles that are just numbers
  if (typeof title === "number") {
    title = title.toString();
    deepSet(settings, "solution.title", title);
  }

  // We need to carry some state through the promise chains
  // so we initialize an object outside the chain
  const state: any = {};

  // TODO: Eventually we'd like Enums
  const teamsToCreate: HubTeamType[] = ["core", "content", "followers"];

  return createHubTeams({
    title,
    types: teamsToCreate,
    hubRequestOptions,
  })
    .then((teams) => {
      // fold teams into the settings hash - used mainly for cards
      settings.teams = cloneObject(teams.props);
      state.teams = teams;
      // directly set the teams into the template item as this ensures
      // the team props are always set vs relying on adlib vars to exist
      Object.assign(template.item.properties, teams.props);
      if (getProp(teams, "props.contentGroupId")) {
        deepSet(template, "data.catalog.groups", [teams.props.contentGroupId]);
      }
      // sites need unique domains names
      // We derive this from the title, unless the title has unicode chars
      // in which case we use `site`, and the `ensureUniqueDomainName` function
      // will increment that as needed - i.e. `site-23`
      let domainTitle = title;
      if (hasUnicodeChars(domainTitle)) {
        domainTitle = "site";
      }
      return ensureUniqueDomainName(slugify(domainTitle), hubRequestOptions);
    })
    .then((uniqueSubdomain) => {
      const portal = hubRequestOptions.portalSelf;
      // TODO: Revisit this if/when we do more site templates which we want to maintain their theme
      settings.solution.theme = getOrgDefaultTheme(portal);
      // set site-specific settings properties...
      settings.solution.subdomain = uniqueSubdomain;
      // setup the url properties
      if (hubRequestOptions.isPortal) {
        settings.solution.defaultHostname = getPortalSiteHostname(
          uniqueSubdomain,
          portal
        );
        settings.solution.url = getPortalSiteUrl(uniqueSubdomain, portal);
      } else {
        const base = stripProtocol(getHubApiUrl(hubRequestOptions));
        settings.solution.defaultHostname = `${uniqueSubdomain}-${portal.urlKey}.${base}`;
        settings.solution.url = `https://${uniqueSubdomain}-${portal.urlKey}.${base}`;
      }

      // create the initiative
      let handleInitiative = Promise.resolve(null);

      if (product !== "portal") {
        handleInitiative = _createSiteInitiative(
          template,
          settings,
          transforms,
          hubRequestOptions
        );
      }
      return handleInitiative;
    })
    .then((maybeInitiative) => {
      // if we got an initiative back...
      let teamUpdatePromise = Promise.resolve(null);
      if (maybeInitiative) {
        // add to settings hash so it's available to the site
        // typically all that's used is initiative.item.id
        settings.initiative = maybeInitiative;
        // directly set the parentInitiativeId vs relying on adlib
        template.item.properties.parentInitiativeId = maybeInitiative.item.id;
        // check if we created a followers team because we need to add the initiativeId into a tag
        teamUpdatePromise = _updateTeamTags(
          maybeInitiative,
          state.teams,
          hubRequestOptions
        );
      }
      return teamUpdatePromise;
    })
    .then((_) => {
      const siteModel = interpolateSite(template, settings, transforms);

      // Special logic for the site title
      // if the title is a string, containing only numbers, then the interpolation will set it as
      // a number, which causes some problems... in that case, we stomp it in as a string...
      if (typeof siteModel.item.title === "number") {
        siteModel.item.title = getProp(settings, "solution.title");
        siteModel.data.values.title = getProp(settings, "solution.title");
      }

      return siteModel;
    })
    .catch((ex) => {
      throw Error(`site-utils::createSiteModelFromTemplate Error ${ex}`);
    });
}

/**
 * From Stackoverflow
 * https://stackoverflow.com/questions/147824/how-to-find-whether-a-particular-string-has-unicode-characters-esp-double-byte
 * This is the highest performance solution, combining three approaches
 */
const unicodeCharRegex = /[^\u0000-\u00ff]/;
function hasUnicodeChars(value: string): boolean {
  if (value.charCodeAt(0) > 255) return true;
  return unicodeCharRegex.test(value);
}
