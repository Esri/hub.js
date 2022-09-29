import { asyncForEach, IArcGISContext } from "../..";
import { IContainsResponse, IDeepCatalogInfo } from "../../search";
import { Catalog } from "../../search/Catalog";

/**
 * Check if a particular entity is contained in a catalog.
 *
 * Unlike `Catalog.contains(...)`, this function can checks multiple catalogs to validate
 * transitive containment.
 *
 * Scenario:
 * - Site `00a`'s Catalog contains Initiative `00b`.
 * - Initiative `00b`'s Catalog contains Project `00c`.
 * - Project `00c`'s catalog contains Dataset `00d`.
 *
 * Problem: Validate that `00d` should be displayed in the context of `00a`.
 *
 * Logic:
 * - Check if `00d` is contained in `00c`'s catalog
 * - Check if `00c` is contained in `00b`'s catalog
 * - Check if `00b` is contained in `00a`'s catalog
 * If all three are true, then `00d` is considered contained in `00a`'s catalog.
 *
 * @param identifier
 * @param options
 * @returns
 */
export async function deepContains(
  identifier: string,
  hierarchy: IDeepCatalogInfo[],
  context: IArcGISContext
): Promise<IContainsResponse> {
  const start = Date.now();
  const response: IContainsResponse = {
    identifier,
    isContained: false,
    catalogInfo: {},
    duration: 0,
  };
  // if no hiearchy, we can't do anything
  if (!hierarchy || hierarchy.length === 0) {
    return Promise.resolve(response);
  }

  // get the ids, in order from the hiearchy as that
  // defines to order we need to check.
  // remove the last entry b/c that's the top level (usually the site)
  // and we don't need to check if that's contained in itself.
  const catalogIds = hierarchy.map((c) => c.id).slice(0, -1);
  // add the passed in identifier as the first id to check
  const idsToCheck = [identifier, ...catalogIds];

  // iterate the hierarchy
  await asyncForEach(hierarchy, async (catalogInfo, idx) => {
    const currentIdentifier = idsToCheck[idx];
    // create a catalog instance
    let catalog: Catalog;
    if (catalogInfo.catalog) {
      // create instance
      catalog = Catalog.fromJson(catalogInfo.catalog, context);
    } else {
      // otherwise, fetch the catalog and check it
      catalog = await Catalog.init(catalogInfo.id, context);
    }
    // add to the response cache
    response.catalogInfo[catalogInfo.id] = {
      id: catalogInfo.id,
      entityType: catalogInfo.entityType,
      catalog: catalog.toJson(),
    };
    // check it
    const check = await catalog.contains(currentIdentifier, {
      entityType: catalogInfo.entityType,
    });
    response.isContained = check.isContained;
  });
  const end = new Date().getTime();
  response.duration = end - start;
  return response;
}
