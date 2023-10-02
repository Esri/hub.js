import { AssociationType, IAssociationInfo } from "../../associations/types";

/**
 * Composable behavior that adds permissions to an entity
 */
export interface IWithAssociationBehavior {
  /**
   * Get a list of the associations for an AssociationType
   * @param type
   */
  listAssociations(type: AssociationType): IAssociationInfo[];

  /**
   * Add an association to the entity.
   * Entity needs to be saved after calling this method
   * @param info
   */
  addAssociation(info: IAssociationInfo): void;
  /**
   * Remove an association to the entity.
   * Entity needs to be saved after calling this method
   * @param info
   */
  removeAssociation(info: IAssociationInfo): void;
}
