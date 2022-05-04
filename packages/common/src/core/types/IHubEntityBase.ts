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
   * Sanitized summary derived from item.snippet, item.description,
   * group.description, user.description, event.description etc
   */
  summary?: string;
  /**
   * Date the entity was created
   */
  createdDate: Date;
  /**
   * Source of the creation date as a property path
   * e.q `item.created`
   */
  createdDateSource: string;
  /**
   * Date when the entity was last updated
   * Depending on the entity, this could be derived
   * in many different ways
   */
  updatedDate: Date;
  /**
   * Source of the updated date
   */
  updatedDateSource: string;
  /**
   * For Item backed results, this will be `item.type`
   * Otherwise it will be "Group", "User", "Event" etc
   */
  type: string;
}
