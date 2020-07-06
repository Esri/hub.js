import {
  IModelTemplate,
  IHubRequestOptions,
  IInitiativeModelTemplate,
  without,
  interpolate,
  IInitiativeModel,
  getProp,
  IModel
} from "@esri/hub-common";
import { getInitiativeTemplate, addInitiative } from "@esri/hub-initiatives";
import { shareItemWithGroup } from "@esri/arcgis-rest-portal";

/**
 * Given a Site Template, locate the initiative template
 * then adlib it and create the initiative item
 * @param {object} siteTemplate Site Template
 * @param {object} settings adlib interpolation hash
 * @param {object} transforms adlib transforms hash
 * @param {IHubRequestOptions}} hubRequestOptions
 * @private
 */
export function _createSiteInitiative(
  siteTemplate: IModelTemplate,
  settings: any,
  transforms: any,
  hubRequestOptions: IHubRequestOptions
): Promise<IInitiativeModel> {
  const cache: any = {};
  return getInitiativeTemplate(siteTemplate, hubRequestOptions)
    .then((initiativeTemplate: IInitiativeModelTemplate) => {
      // set the url that will be in the site
      initiativeTemplate.item.url = settings.solution.url;
      initiativeTemplate.item.title = settings.solution.title;
      initiativeTemplate.item.owner = hubRequestOptions.authentication.username;
      initiativeTemplate.item.typeKeywords = without(
        initiativeTemplate.item.typeKeywords,
        "Hub Initiative Template"
      );
      initiativeTemplate.item.type = "Hub Initiative";
      // set the teams...
      Object.assign(initiativeTemplate.item.properties, settings.teams);
      // adlib to pick up anything else...
      const initiativeModel = interpolate(
        initiativeTemplate,
        settings,
        transforms
      );
      // and save it
      return addInitiative(initiativeModel, hubRequestOptions);
    })
    .then((model: IModel) => {
      // hold in cache
      cache.model = model;
      // default to a success response
      let sharePrms: Promise<any> = Promise.resolve({ success: true });
      // share it to the collab team if that got created
      const collabGroupId = getProp(settings, "teams.collaborationGroupId");
      if (collabGroupId) {
        sharePrms = shareItemWithGroup({
          id: model.item.id,
          groupId: collabGroupId,
          authentication: hubRequestOptions.authentication,
          confirmItemControl: true
        });
      }
      return sharePrms;
    })
    .then((_: any) => {
      return cache.model;
    })
    .catch((ex: any) => {
      throw Error(`site-utils::_createSiteInitiative Error ${ex}`);
    });
}
