import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { isDiscussable } from "../../discussions";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { SiteDefaultFeatures } from "./SiteBusinessRules";
import { IHubSite } from "../../core/types/IHubSite";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { computeLinks } from "./computeLinks";
import { getCatalogFromSiteModel } from "../get-catalog-from-site-model";

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
    const session: UserSession = requestOptions.authentication as UserSession;
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

  // get new catalog structure
  site.catalog = getCatalogFromSiteModel(model);

  // Perform schema upgrades on the new catalog structure
  site.catalog = upgradeCatalogSchema(site.catalog);

  // cast b/c this takes a partial but returns a full site
  return site as IHubSite;
}
