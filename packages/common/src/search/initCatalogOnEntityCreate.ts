import { IHubItemEntity } from "../core";
import { getWellKnownGroup, HubGroup } from "../groups";
import { IArcGISContext } from "../types";
import { ICatalogSetup, IHubCatalog } from "./types";
import { CATALOG_SCHEMA_VERSION } from "./upgradeCatalogSchema";

/**
 * Initializes an returns a catalog to persist on Hub item
 * entity upon creation based on user-configured options.
 *
 * @param entity - Hub item entity
 * @param catalogSetup - options for initializing the catalog
 * @param context - contextual portal & auth information
 */
export const initCatalogOnEntityCreate = async (
  entity: IHubItemEntity,
  catalogSetup: ICatalogSetup,
  context: IArcGISContext
): Promise<IHubCatalog> => {
  // If a user elects to initialize the entity with an
  // existing group, we grab the id of the group they've
  // selected.
  let groupId = catalogSetup.groupId?.[0];

  // If a user elects to initialize the catalog with a
  // new group, we create the new group
  if (catalogSetup?.type === "newGroup") {
    const partialGroup = {
      ...getWellKnownGroup("hubViewGroup", context),
      name: `${entity.name} Content`,
    };
    const group = await HubGroup.create(partialGroup, context, true);
    groupId = group.toJson().id;
  }

  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    scopes: {
      item: {
        targetEntity: "item",
        filters: [{ predicates: [{ group: [groupId] }] }],
      },
      event: {
        targetEntity: "event",
        filters: [{ predicates: [{ group: [groupId] }] }],
      },
    },
    collections: [],
  };
};
