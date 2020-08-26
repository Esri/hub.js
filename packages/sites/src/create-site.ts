import {
  IModel,
  IHubRequestOptions,
  serializeModel,
  cloneObject,
  interpolateItemId,
  uploadResourcesFromUrl,
  getProp
} from "@esri/hub-common";
import { ensureRequiredSiteProperties } from "./ensure-required-site-properties";
import {
  createItem,
  protectItem,
  updateItem,
  shareItemWithGroup
} from "@esri/arcgis-rest-portal";
import { registerSiteAsApplication } from "./register-site-as-application";
import { _addSiteDomains } from "./_add-site-domains";
import { updateInitiativeSiteId } from "@esri/hub-initiatives";

/**
 * Create a New Site
 * Creates and protects the site item
 * Uploads any assets/thumbnails passed in via options.assets array
 * If not portal..,
 * - register the site as an application, w/ needed redirect uris
 * - register the domains with the Hub Domain Service
 * @param {Object} model Site Model to create
 * @param {Object} options options hash. Key prop is assets
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function createSite(
  model: IModel,
  options: any,
  hubRequestOptions: IHubRequestOptions
): Promise<IModel> {
  // ensure properties
  model = ensureRequiredSiteProperties(
    model,
    hubRequestOptions.authentication.username,
    hubRequestOptions.isPortal
  );

  // create the item
  return createItem({
    item: serializeModel(model),
    owner: model.item.owner,
    authentication: hubRequestOptions.authentication
  })
    .then(createResponse => {
      // hold onto the Id so we can return a complete model
      model.item.id = createResponse.id;

      // protect it
      return protectItem({
        id: model.item.id,
        owner: model.item.owner,
        authentication: hubRequestOptions.authentication
      });
    })
    .then(protectResponse => {
      // do app registration
      return registerSiteAsApplication(model, hubRequestOptions);
    })
    .then(appRegistrationResponse => {
      // store the clientId
      model.data.values.clientId = appRegistrationResponse.client_id;
      // If we have a dcat section, hoist it out as it may contain complex adlib
      // templates that are needed at run-time
      // If we have data.values.dcatConfig, yank it off b/c that may have adlib template stuff in it
      const dcatConfig = cloneObject(model.data.values.dcatConfig);
      delete model.data.values.dcatConfig;
      // with the id of the actual item
      model = interpolateItemId(model);
      // re-attach if we got anything...
      if (dcatConfig) {
        model.data.values.dcatConfig = dcatConfig;
      }

      return updateItem({
        item: serializeModel(model),
        authentication: hubRequestOptions.authentication
      });
    })
    .then(updateResponse => {
      // Handle domains
      return _addSiteDomains(model, hubRequestOptions);
    })
    .then(domainResponses => {
      // upload resources from url
      return uploadResourcesFromUrl(
        model,
        options.assets || [],
        hubRequestOptions
      );
    })
    .then(uploadResponses => {
      // default to a success response
      let sharePrms: Promise<any> = Promise.resolve({ success: true });
      // share it to the collab team if that got created
      const collabGroupId = getProp(
        model,
        "item.properties.collaborationGroupId"
      );
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
    .then(resp => {
      // if we created an initiative, ensure we inject the site Id into it
      const initiativeItemId = getProp(
        model,
        "item.properties.parentInitiativeId"
      );
      if (initiativeItemId) {
        // get the item and update it
        return updateInitiativeSiteId(
          initiativeItemId,
          model.item.id,
          hubRequestOptions
        );
      } else {
        return Promise.resolve(true);
      }
    })
    .then(resp => {
      return model;
    })
    .catch(err => {
      throw Error(
        `site-utils::createSite - Error creating site ${JSON.stringify(err)}`
      );
    });
}
