import { IHubCollectionPersistance } from "../../search/types/IHubCatalog";
import { IModel } from "../../types";

/**
 * Reflects changes from a site model's collections to the `site.data.values.searchCategories`
 * legacy property. This is needed stop-gap since old search page will coexist for a time with
 * the new workspaces UI and the old search page relies on the `searchCategories` construct.
 *
 * @param model a site item model
 * @returns a model with the catalog collections and search categories in sync
 */
export function reflectCollectionsToSearchCategories(model: IModel) {
  const collectionToSearchCategory: Record<string, string> = {
    dataset: "components.search.category_tabs.data",
    // NOTE: the `searchCategories` construct actually has two possible labels for the
    // `site` collection: "Sites" or "Initiatives". "Sites" is used if a site was created
    // with Hub Basic, "Initiatives" was used if a site was created with Hub Premium.
    // Since the new search page only uses "Sites", we've opted to ignore "Initiatives"
    site: "components.search.category_tabs.sites",
    appAndMap: "components.search.category_tabs.apps_and_maps",
    document: "components.search.category_tabs.documents",
  };
  const searchCategoryToQueryParam: Record<string, string> = {
    "components.search.category_tabs.data": "Dataset",
    "components.search.category_tabs.sites": "Site",
    "components.search.category_tabs.apps_and_maps": "App,Map",
    "components.search.category_tabs.documents": "Document",
  };
  const collections: IHubCollectionPersistance[] =
    model.data.catalogv2.collections;

  const updatedSearchCategories = collections
    // The 'all' tab isn't persisted as a search category
    .filter((c) => c.key !== "all")
    .map((collection) => {
      const searchCategoryKey = collectionToSearchCategory[collection.key];
      const updated: any = {
        hidden: collection.hidden,
        key: searchCategoryKey,
        queryParams: {
          collection: searchCategoryToQueryParam[searchCategoryKey],
        },
      };

      // If `collection.label` is falsy, we assume that the UI should display the
      // default translated label for that collection. We also assume that if
      // `collection.label` _does_ have a value, then it must be a configured override.
      if (collection.label) {
        updated.overrideText = collection.label;
      }

      return updated;
    });

  model.data.values.searchCategories = updatedSearchCategories;
  return model;
}
