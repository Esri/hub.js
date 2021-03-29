import { IModel, IHubRequestOptions } from "@esri/hub-common";
import { updateSite } from "../update-site";
import { updatePage, isPage } from "../pages";
import { isSite } from "../is-site";
import { IUpdateItemResponse } from "@esri/arcgis-rest-portal";
import { hasUnpublishedChanges } from "./has-unpublished-changes";

/**
 * Saves the published status of a site or page model
 * leaving everything else on the model alone.
 *
 * @param siteOrPageModel
 * @param hubRequestOptions
 */
export function savePublishedStatus(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<IUpdateItemResponse> {
  const allowList = ["item.typeKeywords"]; // only want to save typeKeywords
  const { item } = siteOrPageModel;
  let prms;

  if (isSite(item)) {
    // when saving a draft site, we need to prevent the schemaVersion
    // from being updated. otherwise, if the user does not publish the draft,
    // functionality potentially will be broken for all users because the item
    // reflects the most recent schemaVersion without any of the actual schema
    // changes
    const isUnpublished = hasUnpublishedChanges(siteOrPageModel);
    prms = updateSite(siteOrPageModel, {
      ...hubRequestOptions,
      allowList,
      updateVersions: !isUnpublished
    });
  } else if (isPage(item)) {
    prms = updatePage(siteOrPageModel, allowList, hubRequestOptions);
  } else {
    throw TypeError(
      "@esri/hub-sites: only page or site models have a published state"
    );
  }

  return prms;
}
