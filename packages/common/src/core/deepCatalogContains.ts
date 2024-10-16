import { IArcGISContext } from "../ArcGISContext";
import { getProp } from "../objects/get-prop";
import { getEntityTypeFromType } from "../search/_internal/getEntityTypeFromType";
import { IHubCatalog } from "../search/types/IHubCatalog";
import { IContainsResponse, IDeepCatalogInfo } from "../search/types/types";
import { deepContains, pathToCatalogInfo } from "./_internal/deepContains";

import { HubEntityType } from "./types/HubEntityType";

/**
 * Check that a specific entity is contained within a hierarchy of catalogs
 * @param identifier id or slug of the entity to check
 * @param hubEntityType Entity type of the identifier
 * @param path
 * @param context
 * @param rootCatalog root level catalog to start checking from
 * @returns
 */
export async function deepCatalogContains(
  identifier: string,
  hubEntityType: HubEntityType,
  path: string,
  context: IArcGISContext,
  rootCatalog?: IHubCatalog
): Promise<IContainsResponse> {
  // convert to catalog infos
  let infos: IDeepCatalogInfo[] = [];
  try {
    infos = pathToCatalogInfo(path);
  } catch (e) {
    return {
      identifier,
      isContained: false,
      catalogInfo: {},
      duration: 0,
      reason: getProp(e, "message") || "An error occurred while parsing path.",
    };
  }

  // add the root catalog to the end of the infos as it's the last one to check
  if (rootCatalog) {
    infos = [
      ...infos,
      {
        id: "root",
        entityType: "item",
        catalog: rootCatalog,
      },
    ];
  }
  const entityType = getEntityTypeFromType(hubEntityType);
  return deepContains(identifier, entityType, infos, context);
}
