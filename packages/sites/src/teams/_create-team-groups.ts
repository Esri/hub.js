import { IGroupTemplate } from "./types";
import { IHubRequestOptions } from "@esri/hub-common";
import { _translateTeamTemplate } from "./_translate-team-template";
import { _createTeamGroup } from "./_create-team-group";
import { IGroup } from "@esri/arcgis-rest-types";

/**
 * Internal: Actually create the team groups
 * @param {String} title Title for the Team group
 * @param {Array} groupTemplates Array of group definitions to create the groups
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _createTeamGroups(
  title: string,
  groupTemplates: IGroupTemplate[],
  translations: Record<string, any>,
  hubRequestOptions: IHubRequestOptions
): Promise<{ props: any; groups: IGroup[] }> {
  // now translate the templates...
  const translatedTemplates = groupTemplates.map(tmpl => {
    return _translateTeamTemplate(tmpl, title, translations);
  });
  // now we actually create the groups... obvs async...
  return Promise.all(
    translatedTemplates.map(grpTmpl => {
      return _createTeamGroup(
        hubRequestOptions.portalSelf.user,
        grpTmpl,
        hubRequestOptions
      );
    })
  )
    .then(groups => {
      // hoist out the id's into a structure that has the groupnameProperty: id
      const props = groups.reduce(
        (acc, grp) => {
          // assign to the property, if one is specified
          if (grp.config.propertyName) {
            acc[grp.config.propertyName] = grp.id;
          }
          return acc;
        },
        {} as any
      );

      // remove config node
      groups.forEach(g => delete g.config);

      // construct the return the hash...
      // props: the props which can be spread into the item.properties hash..
      // groups: the array of groups that were created
      return {
        props,
        groups: groups as IGroup[]
      };
    })
    .catch(ex => {
      throw Error(`Error in team-utils::_createTeamGroups ${ex}`);
    });
}
