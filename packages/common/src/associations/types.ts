import { HubEntityType } from "../core";
import { IQuery } from "../search";

/**
 * associations are hierarchical in nature e.g.
 * there is always a parent and a child in the
 * relationship. This interface allows us to
 * define these hierarchies on an entity-by-entity
 * basis
 */
export interface IHubAssociationHierarchy {
  children: HubEntityType[];
  parents: HubEntityType[];
}

/**
 * association rules stored on the parent entity
 * that define what is "included" by the parent
 *
 * For now, the query will define an association
 * group, and "included" simply means it has
 * been shared with the association group. In
 * the future, the query may contain additional
 * conditions
 */
export interface IHubAssociationRules {
  /** schema version for migration purposes */
  schemaVersion: number;
  /** query that defines what's "included" by a parent */
  query: IQuery;
}

/**
 * ** DEPRECATED: remove in next breaking version **
 *
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
 * ** DEPRECATED: remove in next breaking version **
 *
 * Association type
 */
export type AssociationType = "initiative";
