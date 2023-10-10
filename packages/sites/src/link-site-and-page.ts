import {
  getModelFromOptions,
  IModel,
  includes,
  getProp,
  serializeModel,
  mapBy,
  ensureUniqueString,
  slugify,
  maybePush,
  failSafe,
  shareItemToGroups,
  deepSet,
} from "@esri/hub-common";
import { updateItem } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { isSite } from "./is-site";

/**
 * Link a Page and a Site, or vice-versa
 * This is a super tolerant function. It can be passed id's, models or a mix.
 * It will handle either the site or the page items being missing
 * It will handle cases where the current user lacks update privs to either item or rights
 * to change the sharing. Of course in those cases we clearly can't make the changes, and
 * this function will resolve as though they were made, usually the UI tier will have
 * ensured that the current user has write access to at least one of the main entities
 * @param {ILinkPageAndSiteRequestOptions} linkRequestOptions {siteModel || siteId, pageModel || pageId, authorization }
 */
export function linkSiteAndPage(linkRequestOptions: {
  siteModel?: IModel;
  siteId?: string;
  pageModel?: IModel;
  pageId?: string;
  pageSlug?: string;
  authentication: UserSession;
}): Promise<{ siteModel: IModel; pageModel: IModel }> {
  let shareGroups: string[] = [];
  const promises: Array<Promise<any>> = [];
  let pageModel: IModel;
  let siteModel: IModel;
  const requestOptions = { authentication: linkRequestOptions.authentication };
  // get the models from the options...
  return Promise.all([
    getModelFromOptions("page", linkRequestOptions),
    getModelFromOptions("site", linkRequestOptions),
  ])
    .then((models) => {
      // Should we handle either item being inaccessible?
      [pageModel, siteModel] = models;

      if (!siteModel.isMissing && !pageModel.isMissing) {
        // ensure we actually got a page and site
        if (
          !isSite(siteModel.item) ||
          !includes(["Hub Page", "Site Page"], pageModel.item.type)
        ) {
          return Promise.resolve([]);
        }
        // if we got a both...
        // Link the Site into the Page...
        const siteEntry = {
          id: siteModel.item.id,
          title: siteModel.item.title,
        };

        if (!getProp(pageModel, "data.values.sites")) {
          deepSet(pageModel, "data.values.sites", []);
        }
        const sites = getProp(pageModel, "data.values.sites");
        const hasSiteAlready = includes(
          sites.map((p: any) => p.id),
          siteEntry.id
        );

        if (!hasSiteAlready) {
          pageModel.data.values.sites.push(siteEntry);
          const opts = Object.assign(
            { item: serializeModel(pageModel) },
            requestOptions
          );
          // Not failsafe - could reject
          promises.push(updateItem(opts));
        }

        // Link the Page into the Site
        const pageEntry: any = {
          id: pageModel.item.id,
          title: pageModel.item.title,
        };
        if (!getProp(siteModel, "data.values.pages")) {
          deepSet(siteModel, "data.values.pages", []);
        }
        const pages = getProp(siteModel, "data.values.pages");
        const hasPageAlready = includes(
          pages.map((p: any) => p.id),
          pageEntry.id
        );
        if (!hasPageAlready) {
          const slugs = mapBy("slug", pages);
          // use the passed in slug, or generate a unique slug and add to the page entry...
          pageEntry.slug =
            linkRequestOptions.pageSlug ||
            ensureUniqueString(slugs, slugify(pageEntry.title));
          // push entry into pages array...
          siteModel.data.values.pages.push(pageEntry);
          // update the site item...
          const opts = Object.assign(
            { item: serializeModel(siteModel) },
            requestOptions
          );
          // Not failsafe - could reject
          promises.push(updateItem(opts));
        }
        // Now we need to handle sharing of the Page to the site Collab & Content groups
        // The share functions handle pre-flights so we don't need to be concerned if the page is
        // somehow already shared to the group.
        shareGroups = maybePush(
          getProp(siteModel, "item.properties.collaborationGroupId"),
          shareGroups
        );
        shareGroups = maybePush(
          getProp(siteModel, "item.properties.contentGroupId"),
          shareGroups
        );
        // NOTE: Since sharing is limited to the owner || admin we failSafe the calls, and hope for the best.
        const failSafeShare = failSafe(shareItemToGroups);
        promises.push(failSafeShare(pageEntry.id, shareGroups, requestOptions));
        // return all the promises...
        return Promise.all(promises);
      } else {
        let msg = `The Page item (${pageModel.item.id}) is inaccessible.`;
        if (siteModel.isMissing) {
          if (pageModel.isMissing) {
            msg = `Both the Page item (${pageModel.item.id}) and the Site item (${siteModel.item.id}) are inaccssible`;
          } else {
            msg = `The Site item (${siteModel.item.id}) is inaccessible.`;
          }
        }
        throw new Error(`Linking Failed: ${msg}`);
      }
    })
    .then(() => {
      // Downside of optionally pusing entries into a promise array, is that you don't really know
      // what is in what index, so we really can't use the return values...
      return {
        pageModel,
        siteModel,
      };
    })
    .catch((err: Error) => {
      throw Error(
        `Error occured linking site ${siteModel.item.id} with ${pageModel.item.id}: ${err}`
      );
    });
}
