import {
  IModel,
  getModelFromOptions,
  withoutByProp,
  getWithDefault,
  maybePush,
  getProp,
  failSafeUpdate,
  failSafe,
  unshareItemFromGroups
} from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Unlink a Page from a Site and vice-versa
 * This is a super tolerant function. It can be passed ids, models or a mix.
 * It will handle either the site or the page items being missing
 * It will handle cases where the current user lacks update privs to either item or rights
 * to change the sharing. Of course in those cases we clearly can't make the changes, and
 * this function will resolve as though they were made, usually the UI tier will have
 * ensured that the current user has write access to at least one of the main entities
 * @param {IUnlinkRequestOptions} unlinkRequestOptions {siteModel || siteId, pageModel || pageId, authorization...}
 */
export function unlinkSiteAndPage(unlinkRequestOptions: {
  siteModel?: IModel;
  siteId?: string;
  pageModel?: IModel;
  pageId?: string;
  authentication: UserSession;
}): Promise<{ siteModel: IModel; pageModel: IModel }> {
  let unshareGroups: string[] = [];
  const promises: Array<Promise<any>> = [];
  let pageModel: IModel;
  let siteModel: IModel;
  const requestOptions = {
    authentication: unlinkRequestOptions.authentication
  };
  // get the models from the options...
  return Promise.all([
    getModelFromOptions("page", unlinkRequestOptions),
    getModelFromOptions("site", unlinkRequestOptions)
  ])
    .then(models => {
      [pageModel, siteModel] = models;
      // Handle the site
      if (!siteModel.isMissing) {
        const pages = getWithDefault(siteModel, "data.values.pages", []);
        // remove the page from the pages array on the model
        siteModel.data.values.pages = withoutByProp(
          "id",
          pageModel.item.id,
          pages
        );
        // collect the groups we'll unshare the page from
        unshareGroups = maybePush(
          getProp(siteModel, "item.properties.collaborationGroupId"),
          unshareGroups
        );
        unshareGroups = maybePush(
          getProp(siteModel, "item.properties.contentGroupId"),
          unshareGroups
        );
        // update the site, but failSafe so we don't have to do any checking if the current user can update it
        promises.push(failSafeUpdate(siteModel, requestOptions));
      }
      // Handle the page
      if (!pageModel.isMissing) {
        const sites = getWithDefault(pageModel, "data.values.sites", []);
        // remove site from sites array on the model
        pageModel.data.values.sites = withoutByProp(
          "id",
          siteModel.item.id,
          sites
        );
        promises.push(failSafeUpdate(pageModel, requestOptions));
        // now about the groups
        const failSafeUnshare = failSafe(unshareItemFromGroups);
        promises.push(
          failSafeUnshare(pageModel.item.id, unshareGroups, requestOptions)
        );
      }
      return Promise.all(promises);
    })
    .then(() => {
      // return the updated models
      return {
        pageModel,
        siteModel
      };
    });
}
