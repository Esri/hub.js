import { IHubCatalog } from "../../search/types/IHubCatalog";

/**
 * Expose a the content catalog on an entity
 */
export interface IWithCatalog {
  /**
   * Catalog
   */
  catalog: IHubCatalog;
}
