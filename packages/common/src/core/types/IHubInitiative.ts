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
   * Holds properties that are be the source dynamic values defined by a parent entity
   */
  values?: DynamicValues;
}
