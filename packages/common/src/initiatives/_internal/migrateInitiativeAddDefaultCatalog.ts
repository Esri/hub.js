import { IHubInitiative } from "../../core/types/IHubInitiative";
import { getProp } from "../../objects/get-prop";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { cloneObject } from "../../util";

/**
 * Apply the default catalog to the initiative model
 * @param model
 * @returns
 */
export function migrateInitiativeAddDefaultCatalog(
  initiative: IHubInitiative
): IHubInitiative {
  if (initiative.schemaVersion && initiative.schemaVersion >= 1.1) {
    return initiative;
  } else {
    const clone = cloneObject(initiative);
    // v0 of initiatives did not have a catalog, so we need to add one
    // based on the content group associated with the initiative
    const groupId = getProp(clone, "contentGroupId") as string;
    const group = groupId ? [groupId] : [];

    const catalog: IHubCatalog = {
      schemaVersion: 1,
      title: "Default Initiative Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group,
                },
              ],
            },
          ],
        },
      },
      collections: [],
    };

    clone.catalog = catalog;

    // set the schema version
    clone.schemaVersion = 1.1;

    return clone;
  }
}
