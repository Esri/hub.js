import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";

import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { PageDefaultFeatures } from "./PageBusinessRules";
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import { IHubPage } from "../../core/types/IHubPage";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";

/**
 * Given a model and a page, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param page
 * @param requestOptions
 * @returns
 */
export function computeProps (
  model: IModel,
  page: Partial<IHubPage>,
  requestOptions: IRequestOptions
): IHubPage {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager = requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // compute base properties on page
  page = computeItemProps(model.item, page);
  // thumbnail url
  const thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  // TODO: Remove this once opendata-ui starts using `links.thumbnail` instead
  page.thumbnailUrl = thumbnailUrl;
  page.links = {
    self: getItemHomeUrl(page.id, requestOptions),
    siteRelative: `/pages/${page.id}`,
    siteRelativeEntityType: getHubRelativeUrl("page"),
    workspaceRelative: getRelativeWorkspaceUrl("page", page.id),
    layoutRelative: `/pages/${page.id}/edit`,
    thumbnail: thumbnailUrl,
  };

  /**
   * Features that can be disabled by the entity owner
   * NOTE: Pages do not have any features that can be disabled
   */
  page.features = processEntityFeatures(
    model.data.settings?.features || {},
    PageDefaultFeatures
  );

  // cast b/c this takes a partial but returns a full page
  return page as IHubPage;
}
