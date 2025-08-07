import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../hub-types";

import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { PageDefaultFeatures } from "./PageBusinessRules";
import { IHubPage } from "../../core/types/IHubPage";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { computeLinks } from "./computeLinks";
import { applyPageMigrations } from "./applyPageMigrations";

/**
 * Given a model and a page, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param page
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  page: Partial<IHubPage>,
  requestOptions: IRequestOptions
): IHubPage {
  let token: string;
  // istanbul ignore next - this logic is covered elsewhere and should be refactored into a shared util
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // compute base properties on page
  page = computeItemProps(model.item, page);
  // thumbnail url
  const thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  // TODO: Remove this once opendata-ui starts using `links.thumbnail` instead
  page.thumbnailUrl = thumbnailUrl;
  page.links = computeLinks(model.item, requestOptions);

  /**
   * Features that can be disabled by the entity owner
   * NOTE: Pages do not have any features that can be disabled
   */
  page.features = processEntityFeatures(
    model.data.settings?.features || {},
    PageDefaultFeatures
  );

  // Apply migrations
  page = applyPageMigrations(page as IHubPage);

  // cast b/c this takes a partial but returns a full page
  return page as IHubPage;
}
