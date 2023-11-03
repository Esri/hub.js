import { WellKnownAssociationCatalog } from "../../associations/getWellKnownAssociationCatalog";
import { EntityType, IHubCatalog, IHubCollection } from "../types";
import { WellKnownCatalog } from "../wellKnownCatalog";

/**
 * Build an IHubCatalog definition JSON object based on the
 * catalog name, predicates and collections we want to use for each catalog
 * @param i18nScope
 * @param catalogName
 * @param predicates Predicates for the catalog
 * @param collections Collections to include for the catalog
 * @returns An IHubCatalog definition JSON object
 */
export function buildCatalog(
  i18nScope: string,
  catalogName: WellKnownCatalog | WellKnownAssociationCatalog,
  predicates: any[],
  collections: IHubCollection[],
  entityType: EntityType
): IHubCatalog {
  let scopes;
  switch (entityType) {
    case "item":
      scopes = {
        item: {
          targetEntity: "item" as EntityType,
          filters: [{ predicates }],
        },
      };
      break;
    case "group":
      scopes = {
        group: {
          targetEntity: "group" as EntityType,
          filters: [{ predicates }],
        },
      };
      break;
  }
  return {
    schemaVersion: 1,
    title: `{{${i18nScope}catalog.${catalogName}:translate}}`,
    scopes,
    collections,
  };
}
