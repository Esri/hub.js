/**
 * Base properties for Hub Entities
 * This is a subset of `IItem`, that can apply to
 * models that are not backed by items.
 */
export interface IHubEntityBase {
  /**
   * Id of the entity as a string
   */
  id: string;
  /**
   * Name of the Entity
   * For Entities backed by items, this is typically the title
   */
  name: string;
  /**
   * Simple summary of the Entity.
   * For items, this is typically the `snippet` property.
   */
  summary?: string;
  /**
   * Date the entity was created
   */
  createdDate: Date;
  /**
   * Source of the creation date
   */
  createdDateSource: string;
  /**
   * Date the entity was last updated
   */
  updatedDate: Date;
  /**
   * Source of the updated date
   */
  updatedDateSource: string;
  /**
   * Type of entity
   */
  type: string;
}
