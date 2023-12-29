import { AssociationType, IAssociationInfo } from "../../associations/types";

/**
 * Composable behavior that adds permissions to an entity
 */
export interface IWithAssociationBehavior {
  /**
   * ** DEPRECATED: This will be removed in the next
   * breaking version **
   *
   * Get a list of the associations for an AssociationType
   * @param type
   */
  listAssociations(type: AssociationType): IAssociationInfo[];

  /**
   * ** DEPRECATED: please use requestAssociation instead.
   * This will be removed in the next breaking version **
   *
   * Add an association to the entity.
   * Entity needs to be saved after calling this method
   * @param info
   */
  addAssociation(info: IAssociationInfo): void;

  /**
   * ** DEPRECATED: please use breakAssociation instead.
   * This will be removed in the next breaking version **
   *
   * Remove an association to the entity.
   * Entity needs to be saved after calling this method
   * @param info
   */
  removeAssociation(info: IAssociationInfo): void;
}
