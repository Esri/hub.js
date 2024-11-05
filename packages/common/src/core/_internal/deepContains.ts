import { IArcGISContext } from "../../ArcGISContext";
import { EntityType, IContainsResponse, IDeepCatalogInfo } from "../../search";
import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { Catalog } from "../../search/Catalog";
import { asyncForEach } from "../../utils/asyncForEach";
import { HubEntityType } from "../types/HubEntityType";
import {
  getHubEntityTypeFromPath,
  parseContainmentPath,
} from "../parseContainmentPath";
import { getEntityTypeFromHubEntityType } from "../getEntityTypeFromHubEntityType";

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
    const type = getHubEntityTypeFromPath(parsedPath.parts[i]);
    infos.push({
      hubEntityType: type,
      id: parsedPath.parts[i + 1],
    });
  }

  // infos are currently in the path order, but we need to reverse them
  // as we check from the leaf to the root
  return infos.reverse();
}

/**
 * @internal
 * @interface
 * Extends `IDeepCatalogInfo` to include additional properties for checking containment.
 */
interface IDeepContainsCheck extends IDeepCatalogInfo {
  /**
   * Identifier to find in the catalog.
   */
  idToFind?: string;
  /**
   * Enitity type we are looking for. This optimizes performance
   * by focusing on specific entity types.
   */
  entityType?: EntityType;
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
  hubEntityType: HubEntityType,
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

  // create an array of checks by mapping over the hieararchy array
  const checks = hierarchy.map((c, idx, arr) => {
    // if this is the first item in the array, we don't have a previous item
    // so we use the identifier, and type passed to the function
    const isFirst = idx === 0;
    const check: IDeepContainsCheck = {
      id: c.id,
      hubEntityType: c.hubEntityType,
      idToFind: isFirst ? identifier : arr[idx - 1].id,
      entityType: isFirst
        ? getEntityTypeFromType(hubEntityType)
        : getEntityTypeFromHubEntityType(arr[idx - 1].hubEntityType),
    };
    if (c.catalog) {
      check.catalog = c.catalog;
    }

    return check;
  });

  // iterate the hierarchy
  await asyncForEach(checks, async (checkDefinition) => {
    // create a catalog instance
    let catalog: Catalog;
    if (checkDefinition.catalog) {
      catalog = Catalog.fromJson(checkDefinition.catalog, context);
    } else {
      // otherwise, fetch the catalog
      const opts = {
        hubEntityType: checkDefinition.hubEntityType,
        prop: "catalog",
      };
      catalog = await Catalog.init(checkDefinition.id, context, opts);
    }
    // add to the response for debugging
    response.catalogInfo[checkDefinition.id] = {
      id: checkDefinition.id,
      hubEntityType: checkDefinition.hubEntityType,
      catalog: catalog.toJson(),
    };
    // check containment
    const check = await catalog.contains(checkDefinition.idToFind, {
      entityType: checkDefinition.entityType,
    });
    // if a containment check fails, update the response
    // we only update it on failure b/c we don't want a positive
    // response to override a negative one higher up the hierarchy
    if (!check.isContained) {
      response.isContained = check.isContained;
      response.reason = `Entity ${checkDefinition.idToFind} not contained in catalog ${checkDefinition.id}`;
    }
  });
  const end = new Date().getTime();
  response.duration = end - start;
  return response;
}
