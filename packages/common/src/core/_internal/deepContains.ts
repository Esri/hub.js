import { IArcGISContext } from "../../ArcGISContext";
import { EntityType, IContainsResponse, IDeepCatalogInfo } from "../../search";
import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { Catalog } from "../../search/Catalog";
import { asyncForEach } from "../../utils/asyncForEach";
import { HubEntityType } from "../types/HubEntityType";
import { parseContainmentPath, pathMap } from "../parseContainmentPath";

/**
 * Convert a path string into an array of `IDeepCatalogInfo` objects.
 * e.g. /initiatives/00a/projects/00b => [{entityType: "item", id: "00a"}, {entityType: "item", id: "00b"}]
 * @param path
 * @returns
 */
export function pathToCatalogInfo(path: string): IDeepCatalogInfo[] {
  // validate path, throw if invalid
  const parsedPath = parseContainmentPath(path);
  if (!parsedPath.valid) {
    throw new Error(parsedPath.reason);
  }

  const infos: IDeepCatalogInfo[] = [];
  for (let i = 0; i < parsedPath.parts.length; i += 2) {
    const type = pathMap[parsedPath.parts[i]] as HubEntityType;
    const entityType = getEntityTypeFromType(type);
    infos.push({
      entityType,
      id: parsedPath.parts[i + 1],
    });
  }

  // infos are currently in the path order, but we need to reverse them
  // as we check from the leaf to the root
  return infos.reverse();
}

/**
 * @internal
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
  entityType: EntityType,
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
  // from this point, we assume containment is true
  // and only change that if one of the checks fails
  response.isContained = true;

  // get the id and targetEntity from each of the entries
  // in the hiearchy
  let checks = hierarchy
    .map((c) => {
      return { id: c.id, entityType: c.entityType };
    })
    .slice(0, -1);
  // prepend in the thing we are checking for
  // as this allows catalog.contains to be much more efficient
  checks = [{ id: identifier, entityType }, ...checks];

  // iterate the hierarchy
  await asyncForEach(hierarchy, async (catalogInfo, idx) => {
    const currentIdentifier = checks[idx].id;
    const currentEntityType = checks[idx].entityType;
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
      entityType: currentEntityType,
    });
    // if a containment check fails, update the response
    // we only update it on failure b/c we don't want a positive
    // response to override a negative one higher up the hierarchy
    if (!check.isContained) {
      response.isContained = check.isContained;
      response.reason = `Entity ${currentIdentifier} not contained in catalog ${catalogInfo.id}`;
    }
  });
  const end = new Date().getTime();
  response.duration = end - start;
  return response;
}
