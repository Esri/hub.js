import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../hub-types";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { SiteDefaultFeatures } from "./SiteBusinessRules";
import { IHubSite } from "../../core/types/IHubSite";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { computeLinks } from "./computeLinks";
import { getCatalogFromSiteModel } from "../get-catalog-from-site-model";
import { getProp } from "../../objects";
import { compareAccess } from "../../access";

/**
 * Given a model and a site, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param site
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  site: Partial<IHubSite>,
  requestOptions: IRequestOptions
): IHubSite {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // compute base properties on site
  site = computeItemProps(model.item, site);
  // thumbnail url
  const thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  // TODO: Remove this once opendata-ui starts using `links.thumbnail` instead
  site.thumbnailUrl = thumbnailUrl;
  site.links = computeLinks(model.item, requestOptions);

  /**
   * Features that can be disabled by the entity owner
   */
  site.features = processEntityFeatures(
    model.data.settings?.features || {},
    SiteDefaultFeatures
  );

  // Get new catalog structure
  site.catalog = getCatalogFromSiteModel(model);

  // Perform schema upgrades on the new catalog structure
  site.catalog = upgradeCatalogSchema(site.catalog);

  // Determine if the site is still using the legacy v1 catalog
  site.isCatalogV1Enabled = !!model.data.catalog;
  
  // Update the hub assistant's access level based on the site's access level if needed
  // Cannot have a sites access level be private while the hub assistant level is org or public
  if (getProp(site, "assistant.access")) {
    site.assistant.access = compareAccess(site.assistant.access, site.access);
  }

  // cast b/c this takes a partial but returns a full site
  return site as IHubSite;
}
