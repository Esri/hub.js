import { IHubCollection } from "../search/types/IHubCatalog";
import { WellKnownCollection } from "../search/wellKnownCatalog";
import { SearchCategories } from "./_internal/enums/searchCategories";
import { defaultSiteCollectionKeys } from "./defaultSiteCollectionKeys";

/**
 * Convert searchCategories to collections. If no searchCategories are provided,
 * the default collections will be returned.
 *
 * @param searchCategories searchCategories from site model (data.values.searchCategories)
 * @returns IHubCollections that respect the searchCategories configuration
 */
export function searchCategoriesToCollections(
  searchCategories?: SearchCategories[]
) {
  const baseCollectionMap = defaultSiteCollectionKeys.reduce((map, key) => {
    // We use well-known predicates for the default collections,
    // but "Apps & Maps" is a special case since it includes both the app and map families
    const predicates =
      key === "appAndMap"
        ? [{ type: { any: ["$app", "$map"] } }]
        : [{ type: { any: [`$${key}`] } }];

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
        filters: [{ predicates }],
      },
      displayConfig: {
        hidden: false,
      },
    };
    return map;
  }, {} as Record<string, IHubCollection>);
  const searchCategoryToCollection: Partial<
    Record<SearchCategories, WellKnownCollection>
  > = {
    [SearchCategories.DATA]: "dataset",
    // Unfortunately, the "site" search category has different keys depending on if the catalog
    // was created for a hub basic or hub premium site. As such, we just account for both.
    [SearchCategories.INITIATIVES]: "site",
    [SearchCategories.SITES]: "site",
    [SearchCategories.DOCUMENTS]: "document",
    [SearchCategories.APPS_AND_MAPS]: "appAndMap",
  };
  // Not every site has `data.values.searchCategories` saved, so we have to keep a bare-bones
  // copy of what the default objects are in opendata-ui.
  // NOTE: The `event` search category has been explicitly omitted. While the classic search view
  // allows for the searching of `events`, the new search view does not.
  const DEFAULT_SEARCH_CATEGORIES: any[] = [
    { key: SearchCategories.SITES, hidden: true },
    { key: SearchCategories.DATA },
    { key: SearchCategories.DOCUMENTS },
    { key: SearchCategories.APPS_AND_MAPS },
  ];
  const legacySearchCategories: any[] =
    searchCategories || DEFAULT_SEARCH_CATEGORIES;

  const configuredCollections = legacySearchCategories
    // The new search view doesn't currently allow for searching events
    .filter((searchCategory) => searchCategory.key !== SearchCategories.EVENTS)
    // Some sites have a borked `data.values.searchCategories` that explicitly includes the `all`
    // collection. We have this check to catch that and any other weird scenarios.
    .filter(
      (searchCategory) =>
        !!searchCategoryToCollection[searchCategory.key as SearchCategories]
    )
    .map((searchCategory) => {
      const collectionKey =
        searchCategoryToCollection[searchCategory.key as SearchCategories];
      const collection = baseCollectionMap[collectionKey];
      collection.label = searchCategory.overrideText || null;
      collection.displayConfig.hidden = !!searchCategory.hidden;
      return collection;
    });

  return configuredCollections;
}
