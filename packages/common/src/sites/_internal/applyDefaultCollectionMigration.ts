import { getProp } from "../../objects/get-prop";
import { IHubCollectionPersistance } from "../../search/types/IHubCatalog";
import { WellKnownCollection } from "../../search/wellKnownCatalog";
import { IModel } from "../../types";

/**
 * Adds default collections to site models that have the new catalog structure.
 * These default collections will have the same name
 *
 * This migration simplifies display logic, as consuming components no longer
 * have to merge `catalog.collections` with the default collection definitions.
 *
 * This migration also lays the foundation for customization, since editors will
 * be able to modify these persisted default objects. For example, editors can
 * change the default labels, display order, or mark a default as "hidden" so the
 * public can't see it.
 *
 * @param model site model to migrate
 * @returns a migrated model with default `IHubCollectionPersistance` objects added
 * to the catalog
 */
export function applyDefaultCollectionMigration(model: IModel): IModel {
  if (getProp(model, "item.properties.schemaVersion") >= 1.8) {
    return model;
  } else {
    const baseCollectionKeys: WellKnownCollection[] = [
      // TODO: add 'all' as a wellknown collection and figure out the
      // ramifications of doing so across the app
      "all" as any,
      "dataset",
      "document",
      "site",
      "appAndMap",
      "document",
    ];
    const baseCollectionMap = baseCollectionKeys.reduce((map, key) => {
      map[key] = {
        // We chose to leave the label as "null" for a couple of reasons. First off,
        // the default collection names are supposed to be translated and we don't
        // have access to i18n services here. Second, because we temporarily have to
        // serialize changes from catalog.collections back to site.data.values.searchCategories
        // for backwards compatibility, we need a way to indicate whether a collection's
        // name has been explicitly set or if it is relying on the default translation.
        // As such, we only set the label on the collection object IFF an explicit
        // override text has been configured.
        label: null,
        key,
        include: [],
        targetEntity: "item",
        scope: {
          targetEntity: "item",
          collection: key,
          filters: [],
        },
      };
      return map;
    }, {} as Record<string, IHubCollectionPersistance>);
    const searchCategoryToCollection: Record<string, WellKnownCollection> = {
      "components.search.category_tabs.data": "dataset",
      // Unfortunately, the "site" search category has different keys depending on if the catalog
      // was created for a hub basic or hub premium site. As such, we just account for both.
      "components.search.category_tabs.initiatives": "site",
      "components.search.category_tabs.sites": "site",
      "components.search.category_tabs.documents": "document",
      "components.search.category_tabs.apps_and_maps": "appAndMap",
    };
    // Not every site has `data.values.searchCategories` saved, so we have to keep a bare-bones
    // copy of what the default objects are in opendata-ui.
    // NOTE: The `event` search category has been explicitly omitted. While the classic search view
    // allows for the searching of `events`, the new search view does not.
    const DEFAULT_SEARCH_CATEGORIES: any[] = [
      { key: "components.search.category_tabs.data" },
      { key: "components.search.category_tabs.sites" },
      { key: "components.search.category_tabs.documents" },
      { key: "components.search.category_tabs.apps_and_maps" },
    ];
    const legacySearchCategories: any[] =
      model.data.values.searchCategories || DEFAULT_SEARCH_CATEGORIES;

    const configuredCollections = legacySearchCategories
      // The new search view doesn't currently allow for searching events
      .filter(
        (searchCategory) =>
          searchCategory.key !== "components.search.category_tabs.events"
      )
      .map((searchCategory) => {
        const collectionKey = searchCategoryToCollection[searchCategory.key];
        const collection = baseCollectionMap[collectionKey];
        collection.label = searchCategory.overrideText || null;
        collection.hidden = searchCategory.hidden;
        return collection;
      });

    // the "all" collection always goes first
    configuredCollections.unshift(baseCollectionMap.all);
    model.data.catalogv2.collections = configuredCollections;

    // set the schema version
    // TODO: Should we really be changing the schema version of a site
    // outside the `upgradeSiteSchema` helper?
    model.item.properties.schemaVersion = 1.8;

    return model;
  }
}
