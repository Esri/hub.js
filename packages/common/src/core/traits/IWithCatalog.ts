import { IHubCatalog } from "../../search";

// DEPRECATED: Use IWithCatalogs instead
export interface IWithCatalog {
  /**
   * Catalog
   */
  catalog: IHubCatalog;
}

/**
 * Expose a set of catalogs on an entity
 */
export interface IWithCatalogs {
  /**
   * Catalogs
   */
  catalogs: IHubCatalog[];
}
