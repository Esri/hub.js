import {
  IHubRequestOptions,
  IModelTemplate,
  serializeModel,
  createItem,
  uploadResourcesFromUrl,
  getWithDefault,
  IItemResource,
  IModel,
} from "@esri/hub-common";
import { ensureRequiredPageProperties } from "./ensure-required-page-properties";
import { linkSiteAndPage } from "../link-site-and-page";
import {
  protectItem,
  shareItemWithGroup,
  ISharingResponse,
  IGroup,
} from "@esri/arcgis-rest-portal";

/**
 * Given a Page model, create the item, protect it, share it, connect it to the site
 * and upload any resources.
 * @param {Object} model Page model to be created as an Item
 * @param {Object} options object containing shareTo, and space for future additions
 * @param {IHubRequestOptions} hubRequestOptions IRequestOptions object, with isPortal
 */
export function createPage(
  model: IModelTemplate,
  options: { shareTo?: Array<Record<string, any>>; assets?: IItemResource[] },
  hubRequestOptions: IHubRequestOptions
): Promise<IModel> {
  // ensure we got authentication
  if (!hubRequestOptions.authentication) {
    throw new Error(
      `createPage must be passed hubRequestOptions.authentication`
    );
  }
  // ensure props

  const newPage = ensureRequiredPageProperties(model, {
    username: hubRequestOptions.authentication.username,
    isPortal: hubRequestOptions.isPortal,
  });
  // convert to a flat object w. .data --> .text as a json string
  const serializedModel = serializeModel(newPage);
  // create the item
  return createItem({
    item: serializedModel,
    owner: newPage.item.owner,
    authentication: hubRequestOptions.authentication,
  })
    .then((createResponse) => {
      // hold onto the Id so we can return a complete model
      newPage.item.id = createResponse.id;
      // protect it
      return protectItem({
        id: newPage.item.id,
        owner: newPage.item.owner,
        authentication: hubRequestOptions.authentication,
      });
    })
    .then((_protectReponse) => {
      // share to any groups
      let sharingPromises: Array<Promise<ISharingResponse>> = [];
      if (Array.isArray(options.shareTo) && options.shareTo.length) {
        // map over the array sharing the item to all groups
        sharingPromises = options.shareTo.map((groupInfo: Partial<IGroup>) => {
          const confirmItemControl: boolean =
            (groupInfo.confirmItemControl as boolean) || false;
          return shareItemWithGroup({
            id: newPage.item.id,
            groupId: groupInfo.id,
            authentication: hubRequestOptions.authentication,
            confirmItemControl,
          });
        });
        newPage.item.access = "shared";
      }
      return Promise.all(sharingPromises);
    })
    .then((_response) => {
      // link page to sites
      const sites = getWithDefault(newPage, "data.values.sites", []) as Array<{
        id: string;
      }>;
      const requestOptions = {
        authentication: hubRequestOptions.authentication,
      };
      return Promise.all(
        sites.map((entry) => {
          const opts = Object.assign(
            {
              siteId: entry.id,
              pageModel: newPage,
            },
            requestOptions
          );
          return linkSiteAndPage(opts);
        })
      );
    })
    .then((_siteLinkingResponse) => {
      // upload resources
      const assets = getWithDefault(options, "assets", []) as IItemResource[];
      return uploadResourcesFromUrl(newPage, assets, hubRequestOptions);
    })
    .then(() => newPage)
    .catch((err) => {
      const e = err as string;
      throw Error(`createPage: Error creating page: ${e}`);
    });
}
