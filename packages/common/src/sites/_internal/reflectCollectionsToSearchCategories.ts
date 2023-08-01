import { WellKnownCollection } from "../../search";
import { IHubCollectionPersistance } from "../../search/types/IHubCatalog";
import { IModel } from "../../types";
import { cloneObject } from "../../util";
import { SearchCategories } from "./types";

/**
 * Reflects changes from a site model's collections to the `site.data.values.searchCategories`
 * legacy property. This is a needed stop-gap since old search page will coexist for a time with
 * the new workspaces UI and the old search page (among others) still rely on the `searchCategories`
 * construct.
 *
 * @param model a site item model
 * @returns a model with the catalog collections and search categories in sync
 */
export function reflectCollectionsToSearchCategories(model: IModel) {
  const clone = cloneObject(model);
  const collectionToSearchCategory: Partial<
    Record<WellKnownCollection, SearchCategories>
  > = {
    dataset: SearchCategories.DATA,
    // NOTE: the `searchCategories` construct actually has two possible labels for the
    // `site` collection: "Sites" or "Initiatives". "Sites" is used if a site was created
    // with Hub Basic, "Initiatives" was used if a site was created with Hub Premium.
    // Since the new search page only uses "Sites", we've opted to ignore "Initiatives"
    site: SearchCategories.SITES,
    appAndMap: SearchCategories.APPS_AND_MAPS,
    document: SearchCategories.DOCUMENTS,
  };

  const searchCategoryToQueryParam: Partial<Record<SearchCategories, string>> =
    {
      [SearchCategories.DATA]: "Dataset",
      [SearchCategories.SITES]: "Site",
      [SearchCategories.APPS_AND_MAPS]: "App,Map",
      [SearchCategories.DOCUMENTS]: "Document",
    };
  const collections: IHubCollectionPersistance[] =
    clone.data.catalog.collections;

  const updatedSearchCategories = collections
    // We don't want to persist any non-standard collection as a search category,
    // such as the "all" collection
    .filter((c) => !!collectionToSearchCategory[c.key as WellKnownCollection])
    .map((c) => {
      const searchCategoryKey =
        collectionToSearchCategory[c.key as WellKnownCollection];
      const updated: any = {
        hidden: c.hidden,
        key: searchCategoryKey,
        queryParams: {
          collection: searchCategoryToQueryParam[searchCategoryKey],
        },
      };

      // If `c.label` is falsy, we assume that the UI should display the
      // default translated label for that collection. We also assume that if
      // `c.label` _does_ have a value, then it must be a configured override.
      if (c.label) {
        updated.overrideText = c.label;
      }

      return updated;
    });

  clone.data.values.searchCategories = updatedSearchCategories;
  return clone;
}
