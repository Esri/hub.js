import { IHubCatalog } from "../../search";

/**
 * Expose a the content catalog on an entity
 */
export interface IWithCatalog {
  /**
   * Catalog
   */
  catalog: IHubCatalog;
}
