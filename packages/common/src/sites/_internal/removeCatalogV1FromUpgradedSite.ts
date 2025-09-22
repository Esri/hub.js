import { IModel } from "../../hub-types";
import { cloneObject } from "../../util";

/**
 * Removes the `catalog` property from upgraded site models. We use site.data.useCatalogV2
 * (a temporary property) to determine if the upgrade has been completed.
 *
 * We need this temporary migration because earlier versions of the site schema upgrade
 * force data.catalog to be present, even if the site is using catalogV2.
 *
 * TODO: Remove this function once we force all sites to use catalogV2.
 * @param model
 * @returns
 */
export function removeCatalogV1FromUpgradedSite(model: IModel): IModel {
  const clone = cloneObject(model);

  if (clone.data.useCatalogV2) {
    delete clone.data.catalog;
  }

  return clone;
}
