import { IQuery } from "../search";

/**
 * Definition of an Association
 * This will be persisted in the item's typekeywords
 * as `type|id`
 */
export interface IAssociationInfo {
  /**
   * Type of the association. Currently only initiative is supported
   */
  type: AssociationType;
  /**
   * Id of the associated item
   */
  id: string;
}

/**
 * Association type
 */
export type AssociationType = "initiative";
// AS WE ADD MORE TYPES, UPDATE THE getItemTypeFromAssociationType FUNCTION

export interface IHubAssociationRules {
  /** schema version for migration purposes */
  schemaVersion: number;
  query: IQuery;
}