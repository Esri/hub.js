import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IHubSite } from "../../core";
import { IModel } from "../../types";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { isDiscussable } from "../../discussions";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { SiteDefaultFeatures } from "./SiteBusinessRules";

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
  // thumbnail url
  site.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  // Handle Dates
  site.createdDate = new Date(model.item.created);
  site.createdDateSource = "item.created";
  site.updatedDate = new Date(model.item.modified);
  site.updatedDateSource = "item.modified";
  site.isDiscussable = isDiscussable(site);
  /**
   * Features that can be disabled by the entity owner
   */
  site.features = processEntityFeatures(
    model.data.settings?.features || {},
    SiteDefaultFeatures
  );

  // Perform schema upgrades on the new catalog structure
  site.catalog = upgradeCatalogSchema(site.catalog);

  // cast b/c this takes a partial but returns a full site
  return site as IHubSite;
}
