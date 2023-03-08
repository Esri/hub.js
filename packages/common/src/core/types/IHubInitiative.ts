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
   * Definition of any dynamic values that can be resolved
   */
  dynamicValues?: DynamicValueDefinition[];
  /**
   * Container for values that can be the source for other dynamic values
   */
  values?: DynamicValues;
}
