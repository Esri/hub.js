import { DynamicValueDefinition } from ".";
import { IWithSlug, IWithPermissions, IWithCatalog } from "../traits";
import { DynamicValues } from "./DynamicValues";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubInitiative
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithPermissions {
  /**
   * Definition of any dynamic values that can be resolved from child entities, service queris or the portal
   */
  dynamicValues?: DynamicValueDefinition[];
  /**
   * Holds a hash of DynamicValues, keyed by the id of the parent for which the values
   * apply. These are the source values used when the parent resolves is own dynamic values.
   * e.g. `values.00c.funding = 1029` is the funding value for the parent with id `00c`
   */
  values?: Record<string, DynamicValues>;
}
