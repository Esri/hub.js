import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";

import { IModel } from "../../hub-types";

import { IHubInitiative } from "../../core";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { InitiativeDefaultFeatures } from "./InitiativeBusinessRules";
import { computeLinks } from "./computeLinks";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";

/**
 * Given a model and an Initiative, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param initiative
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  initiative: Partial<IHubInitiative>,
  requestOptions: IRequestOptions
): IHubInitiative {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  // compute base properties on initiative
  initiative = computeItemProps(model.item, initiative);

  // thumbnail url
  initiative.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  initiative.view = {
    ...model.data.view,
    featuredImageUrl: model.data.view?.featuredImageUrl,
  };

  // Ensure we have a catalog and that its at the current schema
  initiative.catalog = upgradeCatalogSchema(initiative.catalog || {});

  /**
   * Features that can be disabled by the entity owner
   */
  initiative.features = processEntityFeatures(
    model.data.settings?.features || {},
    InitiativeDefaultFeatures
  );

  initiative.links = computeLinks(model.item, requestOptions);

  // cast b/c this takes a partial but returns a full object
  return initiative as IHubInitiative;
}
